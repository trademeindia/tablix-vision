
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, parseAllergens, stringifyAllergens } from "@/types/menu";
import { getErrorMessage } from "@/utils/api-helpers";

// Menu Items
export const fetchMenuItems = async (category_id?: string, restaurant_id?: string) => {
  try {
    console.log("Fetching menu items with restaurant_id:", restaurant_id);
    
    if (!restaurant_id) {
      console.error("Restaurant ID is required");
      return [];
    }
    
    let query = supabase
      .from('menu_items')
      .select('*');
    
    if (category_id) {
      query = query.eq('category_id', category_id);
    }
    
    if (restaurant_id) {
      query = query.eq('restaurant_id', restaurant_id);
    }
    
    // Only fetch available items for public viewing
    query = query.eq('is_available', true);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
    
    console.log('Menu items fetched:', data?.length || 0);
    
    if (!data || data.length === 0) {
      console.warn('No menu items found for restaurant_id:', restaurant_id);
    }
    
    // Return data with properly parsed allergens
    return data ? data.map(item => ({
      ...item,
      allergens: parseAllergens(item.allergens)
    })) : [];
  } catch (error) {
    console.error('Error in fetchMenuItems:', getErrorMessage(error));
    throw error; // Let the caller handle the error with proper fallback
  }
};

export const createMenuItem = async (item: Partial<MenuItem>) => {
  // Ensure required fields are present
  if (!item.name) {
    throw new Error("Item name is required");
  }
  
  if (item.price === undefined || item.price === null) {
    throw new Error("Item price is required");
  }
  
  try {
    console.log("Creating menu item:", item);
    
    // Get current user ID or use a default for demo
    let userId;
    try {
      userId = (await supabase.auth.getUser()).data.user?.id;
    } catch (authError) {
      console.warn("User authentication error, using default ID:", authError);
      userId = "00000000-0000-0000-0000-000000000000"; // Default for demo
    }
    
    if (!userId) {
      console.warn("No user ID found, using default");
      userId = "00000000-0000-0000-0000-000000000000"; // Default for demo
    }
    
    // Prepare the item for insertion
    const dbItem = {
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      image_url: item.image_url,
      model_url: item.model_url,
      media_type: item.media_type,
      media_reference: item.media_reference,
      is_available: item.is_available !== undefined ? item.is_available : true,
      is_featured: item.is_featured !== undefined ? item.is_featured : false,
      ingredients: item.ingredients,
      allergens: stringifyAllergens(item.allergens),
      nutritional_info: item.nutritional_info,
      preparation_time: item.preparation_time,
      restaurant_id: item.restaurant_id,
      user_id: userId // Set user_id for RLS
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
    console.error('Error in createMenuItem:', getErrorMessage(error));
    throw error;
  }
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
  try {
    console.log("Updating menu item:", id, updates);
    
    // Get current user ID or use a default for demo
    let userId;
    try {
      userId = (await supabase.auth.getUser()).data.user?.id;
    } catch (authError) {
      console.warn("User authentication error, using default ID:", authError);
      userId = "00000000-0000-0000-0000-000000000000"; // Default for demo
    }
    
    if (!userId) {
      console.warn("No user ID found, using default");
      userId = "00000000-0000-0000-0000-000000000000"; // Default for demo
    }
    
    const dbUpdates = {
      ...updates,
      allergens: updates.allergens ? stringifyAllergens(updates.allergens) : undefined,
      user_id: userId // Ensure user_id is set for RLS policies
    };
    
    console.log("Sending update to Supabase:", dbUpdates);
    
    const { data, error } = await supabase
      .from('menu_items')
      .update(dbUpdates)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
    
    console.log("Menu item updated successfully:", data[0]);
    
    // Return the updated item with parsed allergens
    return {
      ...data[0],
      allergens: parseAllergens(data[0].allergens)
    };
  } catch (error) {
    console.error('Error in updateMenuItem:', getErrorMessage(error));
    throw error;
  }
};

export const deleteMenuItem = async (id: string) => {
  try {
    console.log("Deleting menu item:", id);
    
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
    
    console.log("Menu item deleted successfully");
    return true;
  } catch (error) {
    console.error('Error in deleteMenuItem:', getErrorMessage(error));
    throw error;
  }
};
