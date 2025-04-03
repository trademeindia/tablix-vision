
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for handling staff profile image storage operations
 */
export const useStaffStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // Upload an image to Supabase Storage
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const bucketName = 'staff-profiles';
    
    try {
      // Generate a unique filename to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      console.log(`Uploading file ${fileName} to bucket ${bucketName}`);
      
      // Ensure the bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket(bucketName);
        
      if (bucketError && bucketError.message !== 'The resource was not found') {
        // If the error is not just "bucket not found", it's a different issue
        console.error('Error checking bucket:', bucketError);
        throw bucketError;
      }
      
      if (!bucketData) {
        console.log(`Bucket ${bucketName} doesn't exist, attempting to create it`);
        try {
          // Try to create the bucket if it doesn't exist
          await supabase.storage.createBucket(bucketName, {
            public: true
          });
          console.log(`Bucket ${bucketName} created successfully`);
        } catch (createError) {
          console.error('Error creating bucket:', createError);
          // Continue anyway, as the bucket might already exist but we just can't see it
        }
      }
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Upload Error',
          description: `Failed to upload image: ${error.message}`,
          variant: 'destructive'
        });
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('File uploaded successfully, public URL:', publicUrlData.publicUrl);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadProfileImage,
    isUploading
  };
};
