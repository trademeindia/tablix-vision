
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const MENU_MEDIA_BUCKET = 'menu-media';

// Helper function to map extensions to MIME types
const getMimeType = (fileName: string): string | undefined => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'glb':
      return 'model/gltf-binary';
    case 'gltf':
      return 'model/gltf+json';
    default:
      return undefined; // Let Supabase infer if unknown
  }
};

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
  
  // Determine content type
  const contentType = getMimeType(file.name);
  
  // Attempt upload with retry logic
  const MAX_RETRIES = 3;
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt < MAX_RETRIES) {
    try {
      console.log(`Upload attempt ${attempt + 1} for ${file.name}`);
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from(MENU_MEDIA_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType
        });
        
      if (error) {
        // If content type is the issue, try without it
        if (error.message?.includes('mime type') || error.message?.includes('not supported')) {
          console.log('Content type issue detected, trying without explicit content type');
          
          const { data: altData, error: altError } = await supabase
            .storage
            .from(MENU_MEDIA_BUCKET)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (altError) {
            throw altError;
          }
        } else {
          throw error;
        }
      }
      
      // Success - get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from(MENU_MEDIA_BUCKET)
        .getPublicUrl(filePath);
        
      return {
        path: filePath,
        url: publicUrl
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      attempt++;
      
      if (attempt < MAX_RETRIES) {
        // Exponential backoff retry
        const delayMs = Math.pow(2, attempt) * 1000;
        console.log(`Upload failed, retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  // If we get here, all attempts failed
  console.error('All upload attempts failed');
  throw lastError || new Error('Upload failed after multiple attempts');
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
  if (!path) return false;
  
  try {
    const { error } = await supabase
      .storage
      .from(MENU_MEDIA_BUCKET)
      .remove([path]);
      
    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to delete file:', err);
    return false;
  }
};
