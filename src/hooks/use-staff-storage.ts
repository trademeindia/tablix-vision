
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from './use-toast';

export const useStaffStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Function to upload profile image to Supabase storage
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    
    try {
      // Generate a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `staff-avatars/${fileName}`;
      
      console.log(`Uploading file to ${filePath}`);
      
      // Check if we can directly upload to Supabase
      try {
        // Try to upload to Supabase
        const { data, error } = await supabase.storage
          .from('public')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (error) {
          console.error('Storage upload error:', error);
          throw error;
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);
          
        console.log('Successfully uploaded to Supabase:', urlData.publicUrl);
        return urlData.publicUrl;
      } catch (storageError) {
        console.error('Unable to use Supabase Storage:', storageError);
        
        // Fallback: Use a placeholder or avatar generator API
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(file.name)}&background=random&color=fff&size=256`;
        console.log('Falling back to generated avatar:', avatarUrl);
        return avatarUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Using a placeholder instead.',
        variant: 'destructive',
      });
      
      // Return a generated avatar as fallback
      return `https://ui-avatars.com/api/?name=Staff&background=random&color=fff&size=256`;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadProfileImage,
    isUploading,
  };
};
