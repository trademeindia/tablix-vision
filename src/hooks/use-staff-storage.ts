
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
    if (!file) return null;
    
    setIsUploading(true);
    const bucketName = 'staff-profiles';
    
    try {
      // Generate a unique filename to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      console.log(`Uploading file ${fileName} to bucket ${bucketName}`);
      
      // Check if the bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket(bucketName);
      
      // If bucket doesn't exist, create it
      if (!bucketData) {
        console.log(`Bucket ${bucketName} doesn't exist, creating it`);
        const { data, error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 2097152, // 2MB limit
        });
        
        if (error) {
          console.error('Error creating bucket:', error);
          throw new Error(`Failed to create storage bucket: ${error.message}`);
        }
      }
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
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
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive'
      });
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
