
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, parseAllergens, stringifyAllergens } from "@/types/menu";
import { transactionService } from "./transactionService";

/**
 * Fetches menu items based on category ID and/or restaurant ID filters
 */
export const fetchMenuItems = async (category_id?: string, restaurant_id?: string) => {
  try {
    console.log("Fetching menu items with restaurant_id:", restaurant_id);
    
    let query = supabase
      .from('menu_items')
      .select('*');
    
    if (category_id) {
      query = query.eq('category_id', category_id);
    }
    
    if (restaurant_id) {
      query = query.eq('restaurant_id', restaurant_id);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
    
    console.log('Menu items fetched:', data && data.length);
    
    if (!data || data.length === 0) {
      console.warn('No menu items found for restaurant_id:', restaurant_id);
    }
    
    return data ? data.map(item => ({
      ...item,
      allergens: parseAllergens(item.allergens)
    })) : [];
  } catch (error) {
    console.error('Error in fetchMenuItems:', error);
    throw error;
  }
};

/**
 * Creates a new menu item with transaction support
 */
export const createMenuItem = async (item: Partial<MenuItem>) => {
  // Ensure required fields are present
  if (!item.name) {
    throw new Error("Item name is required");
  }
  
  if (item.price === undefined || item.price === null) {
    throw new Error("Item price is required");
  }

  // Start transaction
  await transactionService.beginTransaction();
  
  try {
    // Get current user ID
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    const dbItem = {
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      image_url: item.image_url,
      model_url: item.model_url,
      media_type: item.media_type,
      media_reference: item.media_reference,
      is_available: item.is_available,
      is_featured: item.is_featured,
      ingredients: item.ingredients,
      allergens: stringifyAllergens(item.allergens),
      nutritional_info: item.nutritional_info,
      preparation_time: item.preparation_time,
      restaurant_id: item.restaurant_id,
      user_id: userId // Explicitly set user_id for RLS
    };
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert(dbItem)
      .select();
      
    if (error) {
      // Rollback transaction on error
      await transactionService.rollbackTransaction();
      console.error('Error creating menu item:', error);
      throw error;
    }
    
    // Commit transaction
    await transactionService.commitTransaction();
    
    return {
      ...data[0],
      allergens: parseAllergens(data[0].allergens)
    };
  } catch (error) {
    // Ensure rollback on any error
    await transactionService.rollbackTransaction();
    throw error;
  }
};

/**
 * Updates an existing menu item
 */
export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
  // Get current user ID for RLS validation
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  const dbUpdates = {
    ...updates,
    allergens: updates.allergens ? stringifyAllergens(updates.allergens) : undefined,
    user_id: userId // Ensure user_id is set for RLS policies
  };
  
  const { data, error } = await supabase
    .from('menu_items')
    .update(dbUpdates)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
  
  return {
    ...data[0],
    allergens: parseAllergens(data[0].allergens)
  };
};

/**
 * Deletes a menu item by ID
 */
export const deleteMenuItem = async (id: string) => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
  
  return true;
};
