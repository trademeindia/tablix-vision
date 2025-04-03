
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for handling staff profile image storage operations
 */
export const useStaffStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  
  // Check if bucket exists and create it if it doesn't
  const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
    try {
      // First check if the bucket already exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error checking buckets:', bucketsError);
        return false;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (bucketExists) {
        console.log(`Bucket ${bucketName} already exists`);
        return true;
      }
      
      // Create the bucket if it doesn't exist
      console.log(`Creating bucket: ${bucketName}`);
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 2 * 1024 * 1024, // 2MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return false;
      }
      
      console.log(`Successfully created bucket: ${bucketName}`);
      return true;
    } catch (error) {
      console.error('Unexpected error in ensureBucketExists:', error);
      return false;
    }
  };

  // Upload an image to Supabase Storage
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const bucketName = 'staff-profiles';
    
    try {
      // Ensure the bucket exists
      const bucketExists = await ensureBucketExists(bucketName);
      if (!bucketExists) {
        console.error('Failed to ensure bucket exists');
        throw new Error('Failed to prepare storage bucket for upload');
      }

      // Generate a unique filename to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      console.log(`Uploading file ${fileName} to bucket ${bucketName}`);
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('File uploaded successfully, public URL:', publicUrlData.publicUrl);
      
      // Make sure we're returning a complete and valid URL
      const publicUrl = publicUrlData.publicUrl;
      return publicUrl;
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
