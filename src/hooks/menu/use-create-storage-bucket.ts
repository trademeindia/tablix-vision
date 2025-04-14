
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Creates a storage bucket for menu media with proper permissions
 * @param bucketName The name of the bucket to create
 * @returns A Promise that resolves to true if successful
 */
export async function createStorageBucket(bucketName: string = 'menu-media'): Promise<boolean> {
  try {
    console.log(`Attempting to create storage bucket: ${bucketName}`);
    
    // First check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking storage buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${bucketName}`);
      
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800, // 50MB limit for 3D models
        });
      
      if (createError) {
        console.error('Error creating storage bucket:', createError);
        
        // Special case: If the bucket already exists (potential race condition)
        if (createError.message?.includes('already exists')) {
          console.log('Bucket already exists. Continuing with setup...');
          return true;
        }
        
        toast({
          title: "Storage setup error",
          description: `Could not create storage bucket: ${createError.message}`,
          variant: "destructive",
        });
        
        return false;
      }
      
      console.log(`Successfully created bucket: ${bucketName}`);
      
      // Next create policies by inserting a record into our helper table
      // that triggers policy creation via database functions
      try {
        console.log(`Creating storage policies for bucket: ${bucketName}`);
        
        const { error: policyError } = await supabase
          .from('storage_policies_helper')
          .insert([{ bucket_name: bucketName }]);
        
        if (policyError) {
          console.error('Error creating storage policies:', policyError);
          toast({
            title: "Storage policy setup error",
            description: `Could not create storage policies: ${policyError.message}`,
            variant: "default",
          });
          
          // Continue despite policy error - bucket was created
          console.log('Continuing despite policy error...');
        } else {
          console.log('Storage policies created successfully');
        }
      } catch (policyErr) {
        console.error('Exception creating policies:', policyErr);
      }
    } else {
      console.log(`Bucket ${bucketName} already exists`);
    }
    
    return true;
  } catch (err) {
    console.error('Failed to create storage bucket:', err);
    
    toast({
      title: "Storage setup error",
      description: "Could not set up storage for file uploads",
      variant: "destructive",
    });
    
    return false;
  }
}
