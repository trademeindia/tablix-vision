
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const MENU_MEDIA_BUCKET = 'menu-media';

// Helper function to map extensions to MIME types
const getMimeType = (fileName: string): string => {
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
      return 'application/octet-stream'; // Generic binary MIME type for unknown types
  }
};

/**
 * Uploads a file (image or 3D model) to Supabase Storage
 * @param file The file to upload
 * @param restaurantId Restaurant ID to organize files
 * @param menuItemId Optional menu item ID to associate with the file
 * @returns An object containing the path and public URL of the uploaded file
 */
export const uploadFile = async (
  file: File, 
  restaurantId: string, 
  menuItemId?: string
): Promise<{ path: string; url: string }> => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  // Validate file size
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('File size exceeds 50MB limit');
  }
  
  // Determine file type
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  // Validate 3D model file types
  if (fileExt === 'glb' || fileExt === 'gltf') {
    console.log('Uploading 3D model file');
    return upload3DModel(file, restaurantId, menuItemId);
  }
  
  // Validate image file types
  const validImageTypes = ['jpg', 'jpeg', 'png', 'gif'];
  const isValidImageType = fileExt && validImageTypes.includes(fileExt);
  
  if (!isValidImageType) {
    throw new Error('Invalid file type. Only JPG, PNG, GIF, GLB, and GLTF files are allowed.');
  }
  
  // Handle as image upload
  return uploadImage(file, restaurantId, menuItemId);
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
  // Generate a unique file path
  const uniqueId = uuidv4();
  let filePath = `${restaurantId}/`;
  
  if (menuItemId) {
    filePath += `${menuItemId}/`;
  }
  
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  filePath += `${uniqueId}.${fileExt}`;
  
  // Determine content type
  const contentType = getMimeType(file.name);
  console.log(`Uploading ${file.name} as ${contentType} to ${MENU_MEDIA_BUCKET}/${filePath}`);
  
  // Attempt upload with retry logic
  const MAX_RETRIES = 3;
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt < MAX_RETRIES) {
    try {
      console.log(`Upload attempt ${attempt + 1} for ${file.name}`);
      
      // First attempt: Try with explicit content type
      const { data, error } = await supabase
        .storage
        .from(MENU_MEDIA_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType
        });
        
      if (error) {
        console.error('Initial upload attempt failed:', error.message);
        
        // Second attempt: Try without content type
        console.log('Trying alternative upload without explicit content type...');
        const { data: altData, error: altError } = await supabase
          .storage
          .from(MENU_MEDIA_BUCKET)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (altError) {
          // Try one more time with application/octet-stream
          console.log('Trying final upload attempt with generic content type...');
          const { data: finalData, error: finalError } = await supabase
            .storage
            .from(MENU_MEDIA_BUCKET)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true,
              contentType: 'application/octet-stream'
            });
            
          if (finalError) {
            throw new Error(`All upload methods failed: ${finalError.message}`);
          }
        }
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from(MENU_MEDIA_BUCKET)
        .getPublicUrl(filePath);
        
      console.log('Successfully uploaded to Supabase:', publicUrl);
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
 * Uploads an image file to Supabase Storage
 * @param file The file to upload
 * @param restaurantId Restaurant ID to organize files
 * @param menuItemId Optional menu item ID to associate with the image
 * @returns An object containing the path and public URL of the uploaded file
 */
export const uploadImage = async (
  file: File, 
  restaurantId: string, 
  menuItemId?: string
): Promise<{ path: string; url: string }> => {
  // Generate a unique file path
  const uniqueId = uuidv4();
  let filePath = `${restaurantId}/`;
  
  if (menuItemId) {
    filePath += `${menuItemId}/`;
  }
  
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  filePath += `${uniqueId}.${fileExt}`;
  
  // Determine content type
  const contentType = getMimeType(file.name);
  
  try {
    // Upload the file
    const { data, error } = await supabase
      .storage
      .from(MENU_MEDIA_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType
      });
      
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(MENU_MEDIA_BUCKET)
      .getPublicUrl(filePath);
      
    return {
      path: filePath,
      url: publicUrl
    };
  } catch (err) {
    console.error('Error uploading image:', err);
    throw err;
  }
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
