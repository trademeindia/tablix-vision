
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntegrations } from '@/hooks/integrations/use-integrations';
import { useToast } from '@/hooks/use-toast';
import IntegrationCard from '@/components/integrations/IntegrationCard';
import AddIntegrationDialog from '@/components/integrations/AddIntegrationDialog';
import RealtimeSyncStatus from '@/components/integrations/RealtimeSyncStatus';
import { Integration } from '@/types/integration';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const IntegrationsPage = () => {
  const { toast } = useToast();
  const { 
    integrations, 
    isLoading, 
    createIntegration, 
    deleteIntegration,
    syncIntegration,
    isSyncing
  } = useIntegrations();
  const [activeTab, setActiveTab] = useState('all');
  const [integrationToDelete, setIntegrationToDelete] = useState<string | null>(null);

  // Get categories with at least one integration
  const categories = Array.from(
    new Set(integrations.map(i => i.category))
  );

  // Filter integrations based on active tab
  const filteredIntegrations = activeTab === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeTab);

  // Handle integration delete confirmation
  const handleDeleteConfirm = () => {
    if (integrationToDelete) {
      deleteIntegration(integrationToDelete);
      setIntegrationToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-slate-500">Connect your restaurant with third-party services</p>
        </div>
        <AddIntegrationDialog onAddIntegration={createIntegration} />
      </div>
      
      {/* Realtime sync status */}
      <div className="mb-6">
        <RealtimeSyncStatus />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all">
            All Integrations
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {getCategoryName(category)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded float-right"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredIntegrations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  {activeTab === 'all' 
                    ? 'No integrations available yet.' 
                    : `No ${getCategoryName(activeTab)} integrations available yet.`}
                </p>
                <AddIntegrationDialog onAddIntegration={createIntegration} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map(integration => (
                <IntegrationCard 
                  key={integration.id} 
                  integration={integration}
                  onSync={syncIntegration}
                  onDelete={setIntegrationToDelete}
                  isSyncing={isSyncing}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={!!integrationToDelete} onOpenChange={() => setIntegrationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect the integration and remove all associated credentials. 
              Any data that has already been synchronized will remain in your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

// Helper function to get a human-readable category name
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'pos': 'POS Systems',
    'delivery': 'Food Delivery',
    'payment': 'Payment',
    'analytics': 'Analytics',
    'communication': 'Communication',
    'documents': 'Documents',
    'automation': 'Automation',
    'other': 'Other'
  };
  
  return categoryMap[category] || category;
}

export default IntegrationsPage;
