
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  getIntegrations, 
  createIntegration, 
  updateIntegration, 
  deleteIntegration,
  triggerSync
} from '@/services/integration/integrationService';
import { 
  CreateIntegrationRequest, 
  UpdateIntegrationRequest,
  SyncRequest
} from '@/services/integration/types';
import { Integration } from '@/types/integration';
import { 
  ShoppingBag, 
  Truck, 
  BarChart, 
  MessageCircle, 
  FileText, 
  Workflow, 
  Smartphone,
  Utensils,
  CreditCard
} from 'lucide-react';

// This hook manages integrations data and operations
export function useIntegrations(restaurantId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  // Use React Query for data fetching and caching
  const { 
    data: integrations = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['integrations', restaurantId],
    queryFn: async () => {
      if (!restaurantId) {
        // In demo mode, return sample data
        return getMockIntegrations();
      }
      
      try {
        return await getIntegrations(restaurantId);
      } catch (err) {
        console.error("Error fetching integrations:", err);
        // Return mock data as fallback in case of error
        return getMockIntegrations();
      }
    },
    enabled: true,
  });

  // Create integration mutation
  const createIntegrationMutation = useMutation({
    mutationFn: (integration: CreateIntegrationRequest) => 
      createIntegration(restaurantId || '123e4567-e89b-12d3-a456-426614174000', integration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', restaurantId] });
      toast({
        title: 'Integration created',
        description: 'New integration has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating integration',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update integration mutation
  const updateIntegrationMutation = useMutation({
    mutationFn: (integration: UpdateIntegrationRequest) => updateIntegration(integration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', restaurantId] });
      toast({
        title: 'Integration updated',
        description: 'Integration has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating integration',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete integration mutation
  const deleteIntegrationMutation = useMutation({
    mutationFn: (id: string) => deleteIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', restaurantId] });
      toast({
        title: 'Integration deleted',
        description: 'Integration has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting integration',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: (request: SyncRequest) => triggerSync(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', restaurantId] });
      toast({
        title: 'Sync completed',
        description: 'Integration data has been synchronized successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Sync failed',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsSyncing(false);
    },
  });

  // Trigger sync for an integration
  const syncIntegration = async (integrationId: string) => {
    setIsSyncing(true);
    syncMutation.mutate({ integration_id: integrationId });
  };

  // Mock integrations for demo purposes
  function getMockIntegrations(): Integration[] {
    return [
      {
        id: 'pos1',
        name: 'Square POS',
        description: 'Point of Sale system',
        category: 'pos',
        status: 'connected',
        icon: ShoppingBag,
        lastSynced: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        syncFrequency: 'realtime'
      },
      {
        id: 'delivery1',
        name: 'Zomato',
        description: 'Food delivery platform',
        category: 'delivery',
        status: 'connected',
        icon: Utensils,
        lastSynced: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        syncFrequency: 'hourly'
      },
      {
        id: 'delivery2',
        name: 'Swiggy',
        description: 'Food delivery platform',
        category: 'delivery',
        status: 'connected',
        icon: Truck,
        lastSynced: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        syncFrequency: 'hourly'
      },
      {
        id: 'automation1',
        name: 'n8n',
        description: 'Workflow automation',
        category: 'automation',
        status: 'connected',
        icon: Workflow,
        lastSynced: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        syncFrequency: 'daily'
      },
      {
        id: 'payment1',
        name: 'PayU Money',
        description: 'Payment gateway',
        category: 'payment',
        status: 'connected',
        icon: CreditCard,
        lastSynced: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        syncFrequency: 'hourly'
      },
      {
        id: 'comm1',
        name: 'WhatsApp Business',
        description: 'Customer messaging',
        category: 'communication',
        status: 'not_connected',
        icon: MessageCircle
      }
    ];
  }

  return {
    integrations,
    isLoading,
    error,
    isSyncing,
    createIntegration: (integration: CreateIntegrationRequest) => 
      createIntegrationMutation.mutate(integration),
    updateIntegration: (integration: UpdateIntegrationRequest) => 
      updateIntegrationMutation.mutate(integration),
    deleteIntegration: (id: string) => 
      deleteIntegrationMutation.mutate(id),
    syncIntegration
  };
}
