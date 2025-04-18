
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, stringifyAllergens } from "@/types/menu";
import { getErrorMessage } from "@/utils/api-helpers";
import { ensureDemoRestaurantExists } from "../demoSetup";

export const createMenuItem = async (item: Partial<MenuItem>): Promise<MenuItem> => {
  if (!item.name) {
    throw new Error("Item name is required");
  }
  
  if (item.price === undefined || item.price === null) {
    throw new Error("Item price is required");
  }
  
  if (!item.category_id) {
    throw new Error("Category is required");
  }
  
  try {
    console.log("Creating menu item:", item);
    
    let userId;
    try {
      userId = (await supabase.auth.getUser()).data.user?.id;
    } catch (authError) {
      console.warn("User authentication error, using default ID:", authError);
      userId = "00000000-0000-0000-0000-000000000000";
    }
    
    if (!userId) {
      console.warn("No user ID found, using default");
      userId = "00000000-0000-0000-0000-000000000000";
    }
    
    const defaultRestaurantId = "00000000-0000-0000-0000-000000000000";
    const restaurantId = item.restaurant_id || defaultRestaurantId;
    
    await ensureDemoRestaurantExists();
    
    const dbItem = {
      name: item.name,
      description: item.description || null,
      price: parseFloat(item.price.toString()),
      category_id: item.category_id,
      image_url: item.image_url || null,
      model_url: item.model_url || null,
      media_type: item.media_type || null,
      media_reference: item.media_reference || null,
      is_available: item.is_available !== undefined ? item.is_available : true,
      is_featured: item.is_featured !== undefined ? item.is_featured : false,
      ingredients: item.ingredients || null,
      allergens: stringifyAllergens(item.allergens),
      nutritional_info: item.nutritional_info || null,
      preparation_time: item.preparation_time || null,
      restaurant_id: restaurantId,
      user_id: userId
    };
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert(dbItem)
      .select();
      
    if (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
    
    console.log("Menu item created successfully:", data[0]);
    
    return {
      ...data[0],
      allergens: parseAllergens(data[0].allergens)
    };
  } catch (error) {
    console.error('Error in createMenuItem:', getErrorMessage(error));
    throw error;
  }
};

