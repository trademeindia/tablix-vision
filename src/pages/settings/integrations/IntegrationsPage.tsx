
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIntegrations } from '@/hooks/integrations/use-integrations';
import AddIntegrationDialog from '@/components/integrations/AddIntegrationDialog';
import RealtimeSyncStatus from '@/components/integrations/RealtimeSyncStatus';
import CategoryTab from '@/components/integrations/CategoryTab';
import DeleteIntegrationDialog from '@/components/integrations/DeleteIntegrationDialog';
import { getCategoryName } from '@/utils/integration-categories';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const IntegrationsPage = () => {
  const { 
    integrations, 
    isLoading, 
    createIntegration, 
    deleteIntegration,
    syncIntegration,
    isSyncing,
    error
  } = useIntegrations();
  const [activeTab, setActiveTab] = useState('all');
  const [integrationToDelete, setIntegrationToDelete] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Log the state for debugging
  useEffect(() => {
    // console.log('IntegrationsPage rendered with state:', { 
      integrations, 
      isLoading, 
      activeTab,
      error,
      integrationCount: integrations.length
    });
  }, [integrations, isLoading, activeTab, error]);

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
      <div className="container py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Integrations</h1>
            <p className="text-slate-500">Connect your restaurant with third-party services</p>
          </div>
          <AddIntegrationDialog 
            onAddIntegration={createIntegration} 
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
          />
          <button 
            onClick={() => setIsAddDialogOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Add Integration
          </button>
        </div>
        
        {/* Realtime sync status */}
        <div className="mb-6">
          <RealtimeSyncStatus />
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading integrations: {error.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        ) : (
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
              <CategoryTab
                integrations={filteredIntegrations}
                isLoading={isLoading}
                onSync={syncIntegration}
                onDelete={setIntegrationToDelete}
                isSyncing={isSyncing}
                onAddIntegration={() => setIsAddDialogOpen(true)}
                category={activeTab !== 'all' ? activeTab : undefined}
              />
            </TabsContent>
          </Tabs>
        )}
        
        <DeleteIntegrationDialog
          open={!!integrationToDelete}
          onOpenChange={() => setIntegrationToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </DashboardLayout>
  );
};

export default IntegrationsPage;
