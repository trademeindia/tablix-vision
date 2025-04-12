
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to ensure the required storage bucket exists for menu media
 */
export const useStorageBucket = (bucketName: string = 'menu-media') => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeBucket = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First check if the bucket exists
        const { data: buckets, error: listError } = await supabase
          .storage
          .listBuckets();
        
        if (listError) {
          throw new Error(`Error listing buckets: ${listError.message}`);
        }
        
        const bucketExists = buckets.some(bucket => bucket.name === bucketName);
        
        if (!bucketExists) {
          // Create the bucket if it doesn't exist
          const { error: createError } = await supabase
            .storage
            .createBucket(bucketName, {
              public: true, // Make bucket public so files can be accessed without auth
              fileSizeLimit: 52428800, // 50MB max file size
            });
          
          if (createError) {
            throw new Error(`Error creating bucket: ${createError.message}`);
          }
          
          console.log(`Created storage bucket: ${bucketName}`);
        }
        
        setIsReady(true);
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
    
    initializeBucket();
  }, [bucketName]);
  
  return { isReady, isLoading, error };
};
