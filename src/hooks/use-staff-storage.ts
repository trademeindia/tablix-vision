
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for handling staff profile image storage operations
 */
export const useStaffStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  
  // Upload an image to Supabase Storage
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const bucketName = 'staff-profiles';
    
    try {
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
