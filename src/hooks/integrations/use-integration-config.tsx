
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  saveIntegrationConfig, 
  saveIntegrationCredential,
  saveSyncConfig
} from '@/services/integration/integrationService';
import { 
  SaveConfigRequest, 
  SaveCredentialRequest, 
  SaveSyncConfigRequest 
} from '@/services/integration/types';
import { SyncConfig } from '@/types/integration';

export function useIntegrationConfig(integrationId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Get integration credentials
  const { data: credentials, isLoading: isLoadingCredentials } = useQuery({
    queryKey: ['integration-credentials', integrationId],
    queryFn: async () => {
      // In a real app, this would fetch from Supabase
      // For demo purposes, return empty array
      return [];
    },
    enabled: !!integrationId,
  });

  // Get integration configuration
  const { data: configs, isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['integration-configs', integrationId],
    queryFn: async () => {
      // In a real app, this would fetch from Supabase
      // For demo purposes, return empty array
      return [];
    },
    enabled: !!integrationId,
  });

  // Get sync configurations
  const { data: syncConfigs, isLoading: isLoadingSyncConfigs } = useQuery({
    queryKey: ['integration-sync-configs', integrationId],
    queryFn: async () => {
      // In a real app, this would fetch from Supabase
      // For demo purposes, return empty array
      return [] as SyncConfig[];
    },
    enabled: !!integrationId,
  });

  // Save credential mutation
  const saveCredentialMutation = useMutation({
    mutationFn: (credential: SaveCredentialRequest) => saveIntegrationCredential(credential),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration-credentials', integrationId] });
      toast({
        title: 'Credential saved',
        description: 'API credential has been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving credential',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Save config mutation
  const saveConfigMutation = useMutation({
    mutationFn: (config: SaveConfigRequest) => saveIntegrationConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration-configs', integrationId] });
      toast({
        title: 'Configuration saved',
        description: 'Integration configuration has been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving configuration',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Save sync config mutation
  const saveSyncConfigMutation = useMutation({
    mutationFn: (request: SaveSyncConfigRequest) => saveSyncConfig(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration-sync-configs', integrationId] });
      toast({
        title: 'Sync configuration saved',
        description: 'Sync configuration has been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving sync configuration',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Test connection
  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      // In a real app, this would call an Edge Function to test the connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Connection successful',
        description: 'Successfully connected to the integration API.',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Connection failed',
        description: error.message,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsTestingConnection(false);
    }
  };

  return {
    credentials,
    configs,
    syncConfigs,
    isLoadingCredentials,
    isLoadingConfigs,
    isLoadingSyncConfigs,
    isTestingConnection,
    saveCredential: (credential: SaveCredentialRequest) => saveCredentialMutation.mutate(credential),
    saveConfig: (config: SaveConfigRequest) => saveConfigMutation.mutate(config),
    saveSyncConfig: (request: SaveSyncConfigRequest) => saveSyncConfigMutation.mutate(request),
    testConnection,
  };
}
