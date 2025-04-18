
import { useState, useEffect } from 'react';
import { initializeStorage } from './use-create-storage-bucket';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to ensure the required storage bucket exists for menu media
 */
export const useStorageBucket = (bucketName: string = 'menu-media') => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setupBucket = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize storage using edge function
        const success = await initializeStorage();
        
        if (success) {
          console.log('Storage bucket setup successful');
          setIsReady(true);
        } else {
          throw new Error('Failed to set up storage bucket');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error initializing storage';
        console.error(errorMessage);
        setError(err instanceof Error ? err : new Error(errorMessage));
        
        toast({
          title: "Storage initialization error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    setupBucket();
  }, [bucketName]);
  
  return { isReady, isLoading, error };
};
