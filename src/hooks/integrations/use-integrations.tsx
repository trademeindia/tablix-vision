
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
    error,
    isError 
  } = useQuery({
    queryKey: ['integrations', restaurantId],
    queryFn: async () => {
      console.log('Fetching integrations for restaurant:', restaurantId);
      
      // For development/demo mode, use mock data
      try {
        // Mock delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get mock integrations
        const mockData = getMockIntegrations();
        console.log('Using mock integrations data:', mockData);
        return mockData;
      } catch (err) {
        console.error("Error creating mock integrations:", err);
        throw new Error("Failed to load integrations data");
      }
    },
    retry: 1,
  });

  // Log state changes for debugging
  useEffect(() => {
    console.log('useIntegrations hook state:', { 
      integrations, 
      integrationsCount: integrations?.length || 0,
      isLoading, 
      isError,
      error,
      isSyncing 
    });
  }, [integrations, isLoading, error, isSyncing, isError]);

  // Wrap the sync function to manage local sync state
  const syncIntegration = async (integrationId: string) => {
    setIsSyncing(true);
    try {
      await triggerSync(integrationId);
    } catch (error) {
      console.error('Error syncing integration:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    integrations: integrations || [],
    isLoading,
    error,
    isSyncing: isSyncing || isSyncMutating,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    syncIntegration
  };
}
