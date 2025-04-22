
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Creates a storage bucket for menu media if it doesn't exist
 * @returns A Promise that resolves to true if successful
 */
export async function initializeStorage(): Promise<boolean> {
  try {
    console.log('Checking if menu-media bucket exists...');
    
    // First check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }
    
    // Check if menu-media bucket exists
    const menuMediaBucket = buckets.find(bucket => bucket.name === 'menu-media');
    
    if (menuMediaBucket) {
      console.log('menu-media bucket already exists');
      return true;
    }
    
    console.log('Creating menu-media bucket...');
    
    // Create the bucket if it doesn't exist
    const { data, error } = await supabase.storage.createBucket('menu-media', {
      public: true,
      fileSizeLimit: 52428800, // 50MB limit
      allowedMimeTypes: [
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'model/gltf-binary', 
        'model/gltf+json',
        'application/octet-stream' // For GLB files that might not be properly recognized
      ]
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
      
      if (error.message.includes('already exists')) {
        console.log('Bucket already exists (race condition)');
        return true;
      }
      
      toast({
        title: "Storage setup error",
        description: `Could not set up storage: ${error.message}`,
        variant: "destructive",
      });
      
      return false;
    }
    
    console.log('menu-media bucket created successfully');
    return true;
  } catch (err) {
    console.error('Failed to initialize storage:', err);
    toast({
      title: "Storage setup error",
      description: "Could not set up storage. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
}
