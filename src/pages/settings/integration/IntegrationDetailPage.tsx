
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useIntegrations } from '@/hooks/integrations/use-integrations';
import DeleteIntegrationDialog from '@/components/integrations/DeleteIntegrationDialog';

// Tab components
import IntegrationHeader from './components/IntegrationHeader';
import GeneralTab from './components/GeneralTab';
import SyncTab from './components/SyncTab';
import CredentialsTab from './components/CredentialsTab';
import AdvancedTab from './components/AdvancedTab';
import NotFoundMessage from './components/NotFoundMessage';

const IntegrationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { integrations, updateIntegration, deleteIntegration, syncIntegration, isSyncing } = useIntegrations();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Find current integration
  const integration = integrations.find(i => i.id === id);
  
  // State for form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [syncFrequency, setSyncFrequency] = useState<string>('');
  const [activeTab, setActiveTab] = useState('general');
  
  // Set initial form values when integration data loads
  useEffect(() => {
    if (integration) {
      setName(integration.name);
      setDescription(integration.description || '');
      setApiEndpoint(integration.apiEndpoint || '');
      setWebhookUrl(integration.webhookUrl || '');
      setSyncFrequency(integration.syncFrequency || 'manual');
    }
  }, [integration]);
  
  // Handle save
  const handleSave = () => {
    if (!integration || !id) return;
    
    updateIntegration({
      id,
      name,
      description,
      apiEndpoint,
      webhookUrl,
      syncFrequency: syncFrequency as any
    });
    
    toast({
      title: "Integration updated",
      description: "Your changes have been saved successfully."
    });
  };
  
  // Handle delete
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (!id) return;
    
    deleteIntegration(id);
    setShowDeleteDialog(false);
  };
  
  // Handle manual sync
  const handleSync = () => {
    if (id) {
      syncIntegration(id);
    }
  };
  
  // If integration not found, show error message
  if (!integration) {
    return (
      <DashboardLayout>
        <NotFoundMessage />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container py-6">
        <IntegrationHeader integration={integration} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="sync">Sync Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralTab
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              apiEndpoint={apiEndpoint}
              setApiEndpoint={setApiEndpoint}
              webhookUrl={webhookUrl}
              setWebhookUrl={setWebhookUrl}
              handleSave={handleSave}
              handleDelete={handleDelete}
            />
          </TabsContent>
          
          <TabsContent value="sync">
            <SyncTab
              syncFrequency={syncFrequency}
              setSyncFrequency={setSyncFrequency}
              handleSave={handleSave}
              handleSync={handleSync}
              isSyncing={isSyncing}
            />
          </TabsContent>
          
          <TabsContent value="credentials">
            <CredentialsTab handleSave={handleSave} />
          </TabsContent>
          
          <TabsContent value="advanced">
            <AdvancedTab handleSave={handleSave} />
          </TabsContent>
        </Tabs>
        
        <DeleteIntegrationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </DashboardLayout>
  );
};

export default IntegrationDetailPage;
