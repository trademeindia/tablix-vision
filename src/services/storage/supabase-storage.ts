
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const MENU_MEDIA_BUCKET = 'menu-media';

/**
 * Uploads a 3D model file to Supabase Storage
 * @param file The file to upload
 * @param restaurantId Restaurant ID to organize files
 * @param menuItemId Optional menu item ID to associate with the model
 * @returns An object containing the path and public URL of the uploaded file
 */
export const upload3DModel = async (
  file: File, 
  restaurantId: string, 
  menuItemId?: string
): Promise<{ path: string; url: string }> => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  // Validate file type
  const validFileTypes = ['.glb', '.gltf'];
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const isValidFileType = fileExt && validFileTypes.includes(`.${fileExt}`);
  
  if (!isValidFileType) {
    throw new Error('Invalid file type. Only .glb and .gltf files are allowed.');
  }
  
  // Generate a unique file path
  const uniqueId = uuidv4();
  let filePath = `${restaurantId}/`;
  
  if (menuItemId) {
    filePath += `${menuItemId}/`;
  }
  
  filePath += `${uniqueId}.${fileExt}`;
  
  // Upload the file to Supabase Storage
  const { data, error } = await supabase
    .storage
    .from(MENU_MEDIA_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  // Get the public URL of the uploaded file
  const { data: { publicUrl } } = supabase
    .storage
    .from(MENU_MEDIA_BUCKET)
    .getPublicUrl(filePath);
    
  return {
    path: filePath,
    url: publicUrl
  };
};

/**
 * Get the public URL for a file path in Supabase Storage
 * @param path File path within the bucket
 * @returns Public URL for the file
 */
export const getPublicUrl = (path: string): string => {
  const { data: { publicUrl } } = supabase
    .storage
    .from(MENU_MEDIA_BUCKET)
    .getPublicUrl(path);
    
  return publicUrl;
};

/**
 * Deletes a file from Supabase Storage
 * @param path File path within the bucket
 * @returns True if deletion was successful
 */
export const deleteFile = async (path: string): Promise<boolean> => {
  const { error } = await supabase
    .storage
    .from(MENU_MEDIA_BUCKET)
    .remove([path]);
    
  if (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Deletion failed: ${error.message}`);
  }
  
  return true;
};
