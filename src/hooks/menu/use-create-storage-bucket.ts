
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
      console.log(`Bucket ${bucketName} not found, creating it...`);
      
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800, // 50MB limit for 3D models
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'model/gltf-binary',
            'model/gltf+json',
            'application/octet-stream',
            'application/gltf-binary'
          ]
        });
      
      if (createError) {
        console.error('Error creating storage bucket:', createError);
        
        // Special case: If the bucket already exists (potential race condition)
        if (createError.message?.includes('already exists')) {
          console.log('Bucket already exists. Continuing with setup...');
          // Continue to policy setup since bucket exists
        } else {
          toast({
            title: "Storage setup error",
            description: `Could not create storage bucket: ${createError.message}`,
            variant: "destructive",
          });
          
          return false;
        }
      } else {
        console.log(`Successfully created bucket: ${bucketName}`);
      }
      
      // Try to set up storage policies using edge function
      try {
        console.log(`Setting up storage policies for bucket: ${bucketName}`);
        
        // Call edge function to set up policies
        const { error: functionError } = await supabase.functions.invoke('create-storage-policy', {
          body: { bucketName },
        });
        
        if (functionError) {
          console.error('Error invoking edge function for storage policies:', functionError);
          
          // Try to set up policies via direct RPC as fallback
          try {
            const { error: rpcError } = await supabase.rpc('create_storage_policies', { 
              bucket_name: bucketName 
            });
            
            if (rpcError) {
              console.error('Error calling RPC function:', rpcError);
              toast({
                title: "Storage policy setup warning",
                description: "Bucket created but policies may not be fully configured",
                variant: "default",
              });
            } else {
              console.log('Storage policies created successfully via RPC');
            }
          } catch (rpcErr) {
            console.error('Exception in RPC call:', rpcErr);
          }
        } else {
          console.log('Storage policies created successfully via edge function');
        }
      } catch (policyErr) {
        console.error('Exception creating policies:', policyErr);
        // Continue despite policy error - bucket was created
      }
    } else {
      console.log(`Bucket ${bucketName} already exists`);
      
      // Update existing bucket to ensure it has correct settings
      try {
        const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'model/gltf-binary',
            'model/gltf+json',
            'application/octet-stream',
            'application/gltf-binary'
          ]
        });
        
        if (updateError) {
          console.error('Error updating bucket settings:', updateError);
        } else {
          console.log(`Successfully updated bucket settings for: ${bucketName}`);
        }
      } catch (updateErr) {
        console.error('Exception updating bucket:', updateErr);
      }
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
