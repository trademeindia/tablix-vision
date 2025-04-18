
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Creates a storage bucket for menu media with proper permissions
 * This uses the function we've deployed to Supabase Edge Functions
 * @param bucketName The name of the bucket to create
 * @returns A Promise that resolves to true if successful
 */
export async function createStorageBucket(bucketName: string = 'menu-media'): Promise<boolean> {
  try {
    console.log(`Setting up storage bucket: ${bucketName}`);
    
    // Call the edge function to create the bucket with proper permissions
    const { data, error } = await supabase.functions.invoke('create-storage-policy', {
      body: { bucketName }
    });
    
    if (error) {
      console.error('Error creating storage bucket:', error);
      toast({
        title: "Storage setup error",
        description: `Could not set up storage: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
    
    console.log('Storage bucket setup successful:', data);
    return true;
  } catch (err) {
    console.error('Failed to create storage bucket:', err);
    toast({
      title: "Storage setup error",
      description: "Could not set up storage bucket. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
}

// Function to initialize storage bucket
export async function initializeStorage(): Promise<boolean> {
  try {
    // First check if the bucket exists directly using anon key
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      // Continue anyway to try the edge function approach
    } else {
      const bucketExists = buckets?.some(bucket => bucket.name === 'menu-media');
      console.log('Bucket exists check:', bucketExists);
      
      if (bucketExists) {
        console.log('menu-media bucket already exists, no need to create');
        return true;
      }
    }
    
    // Bucket doesn't exist or we couldn't check, try to create it via edge function
    return await createStorageBucket('menu-media');
  } catch (err) {
    console.error('Error initializing storage:', err);
    return false;
  }
}
