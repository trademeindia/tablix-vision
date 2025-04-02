
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
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

export function useIntegrationMutations(restaurantId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
    }
  });

  return {
    createIntegration: (integration: CreateIntegrationRequest) => 
      createIntegrationMutation.mutate(integration),
    updateIntegration: (integration: UpdateIntegrationRequest) => 
      updateIntegrationMutation.mutate(integration),
    deleteIntegration: (id: string) => 
      deleteIntegrationMutation.mutate(id),
    syncIntegration: (integrationId: string) => 
      syncMutation.mutate({ integration_id: integrationId }),
    isSyncMutating: syncMutation.isPending
  };
}
