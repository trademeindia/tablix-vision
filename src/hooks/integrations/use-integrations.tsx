
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getIntegrations } from '@/services/integration/integrationService';
import { Integration } from '@/types/integration';
import { useIntegrationMutations } from './use-integration-mutations';
import { getMockIntegrations } from './mock-integrations';

// This hook manages integrations data and operations
export function useIntegrations(restaurantId?: string) {
  const [isSyncing, setIsSyncing] = useState(false);
  const { 
    createIntegration, 
    updateIntegration, 
    deleteIntegration, 
    syncIntegration: triggerSync,
    isSyncMutating
  } = useIntegrationMutations(restaurantId);

  // Use React Query for data fetching and caching
  const { 
    data: integrations = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['integrations', restaurantId],
    queryFn: async () => {
      console.log('Fetching integrations for restaurant:', restaurantId);
      if (!restaurantId) {
        // In demo mode, return sample data
        console.log('Using mock integrations data');
        return getMockIntegrations();
      }
      
      try {
        const data = await getIntegrations(restaurantId);
        console.log('Fetched integrations data:', data);
        return data;
      } catch (err) {
        console.error("Error fetching integrations:", err);
        // Return mock data as fallback in case of error
        console.log('Using mock integrations as fallback due to error');
        return getMockIntegrations();
      }
    },
    enabled: true,
  });

  // Log state changes for debugging
  useEffect(() => {
    console.log('useIntegrations state:', { 
      integrations, 
      isLoading, 
      error,
      isSyncing 
    });
  }, [integrations, isLoading, error, isSyncing]);

  // Wrap the sync function to manage local sync state
  const syncIntegration = async (integrationId: string) => {
    setIsSyncing(true);
    await triggerSync(integrationId);
    setIsSyncing(false);
  };

  return {
    integrations,
    isLoading,
    error,
    isSyncing: isSyncing || isSyncMutating,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    syncIntegration
  };
}
