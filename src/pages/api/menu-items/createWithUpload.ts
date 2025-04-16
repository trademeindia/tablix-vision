
import { supabase } from '@/lib/supabaseClient';
import { getErrorMessage } from '@/utils/api-helpers';

// We need to convert this from Next.js API route to a Vite React service function
// Let's transform it into a utility function that could be called from a component

/**
 * Creates a menu item with file upload functionality
 * @param formData FormData containing menu item details and file
 * @param restaurantId The restaurant ID
 * @returns The created menu item
 */
export async function createMenuItemWithUpload(formData: FormData, restaurantId: string) {
  try {
    // Extract form data
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('category_id') as string;
    const isAvailable = formData.get('is_available') === 'true';
    const file = formData.get('file') as File;

    // Basic validation
    if (!name) {
      throw new Error("Item name is required");
    }

    if (isNaN(price)) {
      throw new Error("Valid price is required");
    }

    if (!categoryId) {
      throw new Error("Category is required");
    }

    if (!file) {
      throw new Error("Image file is required");
    }

    // Get current authenticated user
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      throw new Error("Authentication required");
    }

    // Upload file to Supabase storage
    const filePath = `${restaurantId}/${categoryId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('menu-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('menu-media')
      .getPublicUrl(filePath);

    // Create the menu item in the database
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name,
        description: description || null,
        price,
        category_id: categoryId,
        media_path: filePath,
        media_type: file.type.startsWith('image/') ? 'image' : (file.type.includes('model') ? '3d' : 'image'),
        is_available: isAvailable,
        external_media_url: null, // We're using storage, not external URL
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      // If menu item creation fails, try to clean up the uploaded file
      await supabase.storage.from('menu-media').remove([filePath]);
      throw error;
    }

    return {
      ...data,
      publicUrl
    };
  } catch (error) {
    console.error('Error in createMenuItemWithUpload:', getErrorMessage(error));
    throw error;
  }
}
