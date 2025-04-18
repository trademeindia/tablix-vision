
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, parseAllergens, stringifyAllergens } from "@/types/menu";
import { getErrorMessage } from "@/utils/api-helpers";

export const createMenuItemWithUpload = async (formData: FormData, restaurantId: string): Promise<MenuItem> => {
  try {
    // Extract form data fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category_id = formData.get('category_id') as string;
    const is_available = formData.get('is_available') === 'true';
    const is_featured = formData.get('is_featured') === 'true';
    const ingredients = formData.get('ingredients') as string;
    const allergens = formData.get('allergens') as string;
    const preparation_time = parseInt(formData.get('preparation_time') as string || '0');
    const file = formData.get('file') as File | null;
    const media_type = formData.get('media_type') as string || undefined;
    const image_url = formData.get('image_url') as string || null;
    const model_url = formData.get('model_url') as string || null;
    const media_reference = formData.get('media_reference') as string || null;

    // Validate required fields
    if (!name) {
      throw new Error("Item name is required");
    }

    if (isNaN(price) || price < 0) {
      throw new Error("Valid price is required");
    }

    if (!category_id) {
      throw new Error("Category is required");
    }

    // Get current user ID
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }
    
    const userId = userData.user.id;

    let fileUrl = null;
    let fileReference = null;
    let determinedMediaType = media_type;

    // Handle file upload if a file was provided
    if (file) {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const fileName = `${Date.now()}_${name.replace(/\s+/g, '_')}.${fileExt}`;
      const filePath = `${restaurantId}/${category_id}/${fileName}`;
      
      // Determine media type from file extension
      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExt);
      const is3DModel = ['glb', 'gltf'].includes(fileExt);
      determinedMediaType = isImage ? 'image' : (is3DModel ? '3d' : 'unknown');
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menu-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('menu-media')
        .getPublicUrl(filePath);
      
      fileUrl = publicUrlData.publicUrl;
      fileReference = filePath;
      
      console.log(`Uploaded ${determinedMediaType === 'image' ? 'image' : '3D model'} to: ${fileUrl}`);
    }

    // Prepare menu item data
    const menuItemData: any = {
      name,
      description: description || null,
      price,
      category_id,
      is_available,
      is_featured: is_featured || false,
      ingredients: ingredients || null,
      allergens: stringifyAllergens(allergens ? { items: allergens.split(',').map(a => a.trim()) } : undefined),
      preparation_time: isNaN(preparation_time) ? null : preparation_time,
      restaurant_id: restaurantId,
      user_id: userId,
      updated_at: new Date().toISOString()
    };

    // Set media fields based on what we have
    if (fileUrl && determinedMediaType === 'image') {
      menuItemData.image_url = fileUrl;
      menuItemData.media_reference = fileReference;
      menuItemData.media_type = 'image';
      menuItemData.model_url = null; // Clear any model URL if this is an image
    } else if (fileUrl && determinedMediaType === '3d') {
      menuItemData.model_url = fileUrl;
      menuItemData.media_reference = fileReference;
      menuItemData.media_type = '3d';
      menuItemData.image_url = null; // Clear any image URL if this is a 3D model
    } else if (image_url) {
      menuItemData.image_url = image_url;
      menuItemData.media_type = 'image';
      menuItemData.model_url = null;
    } else if (model_url) {
      menuItemData.model_url = model_url;
      menuItemData.media_type = '3d';
      menuItemData.image_url = null;
    }

    // Create menu item in database
    console.log("Creating menu item with data:", menuItemData);
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItemData)
      .select()
      .single();

    if (error) {
      console.error('Error creating menu item:', error);
      
      // Clean up uploaded file if the item creation failed
      if (fileReference) {
        await supabase.storage
          .from('menu-media')
          .remove([fileReference]);
      }
      
      throw error;
    }

    console.log("Menu item created successfully:", data);

    // Return the created item with parsed allergens
    return {
      ...data,
      allergens: parseAllergens(data.allergens)
    };
  } catch (error) {
    console.error('Error in createMenuItemWithUpload:', getErrorMessage(error));
    throw error;
  }
};
