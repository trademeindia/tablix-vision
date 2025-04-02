
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIntegrations } from '@/hooks/integrations/use-integrations';
import AddIntegrationDialog from '@/components/integrations/AddIntegrationDialog';
import RealtimeSyncStatus from '@/components/integrations/RealtimeSyncStatus';
import CategoryTab from '@/components/integrations/CategoryTab';
import DeleteIntegrationDialog from '@/components/integrations/DeleteIntegrationDialog';
import { getCategoryName } from '@/utils/integration-categories';

const IntegrationsPage = () => {
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
        <AddIntegrationDialog 
          onAddIntegration={createIntegration} 
        />
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
      
      <DeleteIntegrationDialog
        open={!!integrationToDelete}
        onOpenChange={() => setIntegrationToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  );
};

export default IntegrationsPage;
