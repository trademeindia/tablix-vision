import { supabase } from "@/integrations/supabase/client";
import { MenuItem, parseAllergens, stringifyAllergens } from "@/types/menu";
import { getErrorMessage } from "@/utils/api-helpers";

export const createMenuItemWithUpload = async (formData: FormData, restaurantId: string) => {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category_id = formData.get('category_id') as string;
    const is_available = formData.get('is_available') === 'true';
    const is_featured = formData.get('is_featured') === 'true';
    const ingredients = formData.get('ingredients') as string;
    const allergens = formData.get('allergens') as string;
    const preparation_time = parseInt(formData.get('preparation_time') as string);
    const file = formData.get('file') as File;

    if (!name) {
      throw new Error("Item name is required");
    }

    if (isNaN(price)) {
      throw new Error("Item price is required");
    }

    if (!category_id) {
      throw new Error("Category is required");
    }

    if (!file) {
      throw new Error("File is required");
    }

    // Get current user ID
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Upload the file to Supabase Storage
    const filePath = `${restaurantId}/${category_id}/${name}/${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('menu-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw new Error("Failed to upload file");
    }

    const imageUrl = supabase.storage.from('menu-media').getPublicUrl(filePath).data.publicUrl;

    // Prepare the item for insertion
    const dbItem = {
      name,
      description: description || null,
      price,
      category_id,
      image_url: imageUrl,
      model_url: null,
      media_type: file.type.startsWith('image/') ? 'image' : '3d',
      media_reference: filePath,
      is_available,
      is_featured,
      ingredients: ingredients || null,
      allergens: stringifyAllergens(allergens ? { items: allergens.split(',') } : {}),
      nutritional_info: null,
      preparation_time: preparation_time || null,
      restaurant_id: restaurantId,
      user_id: userId,
    };

    console.log("Sending to Supabase:", dbItem);

    const { data, error } = await supabase
      .from('menu_items')
      .insert(dbItem)
      .select();

    if (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }

    console.log("Menu item created successfully:", data[0]);

    // Return the created item with parsed allergens
    return {
      ...data[0],
      allergens: parseAllergens(data[0].allergens)
    };
  } catch (error) {
    console.error('Error in createMenuItemWithUpload:', getErrorMessage(error));
    throw error;
  }
};