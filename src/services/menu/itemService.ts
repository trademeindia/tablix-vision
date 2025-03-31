import { supabase } from "@/integrations/supabase/client";
import { MenuItem, parseAllergens, stringifyAllergens } from "@/types/menu";
import { transactionService } from "./transactionService";
import { toast } from "@/hooks/use-toast";

/**
 * Fetches menu items based on category ID and/or restaurant ID filters
 */
export const fetchMenuItems = async (category_id?: string, restaurant_id?: string) => {
  try {
    // First check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn('User not authenticated in fetchMenuItems');
      // For public access, we can proceed but log a warning
    }
    
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
      toast({
        title: "Error fetching menu items",
        description: error.message,
        variant: "destructive"
      });
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
  // Check authentication first
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const errorMsg = "Authentication required to create menu items";
    console.error(errorMsg);
    toast({
      title: "Authentication Required",
      description: "Please sign in to create menu items",
      variant: "destructive"
    });
    throw new Error(errorMsg);
  }

  // Ensure required fields are present
  if (!item.name) {
    throw new Error("Item name is required");
  }
  
  if (item.price === undefined || item.price === null) {
    throw new Error("Item price is required");
  }

  // Start transaction
  try {
    await transactionService.beginTransaction();
    
    // Get current user ID
    const userId = session.user.id;
    if (!userId) {
      throw new Error("User ID not available");
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
      is_available: item.is_available ?? true,
      is_featured: item.is_featured ?? false,
      ingredients: item.ingredients,
      allergens: stringifyAllergens(item.allergens),
      nutritional_info: item.nutritional_info,
      preparation_time: item.preparation_time,
      restaurant_id: item.restaurant_id,
      user_id: userId // Explicitly set user_id for RLS
    };
    
    console.log("Creating menu item with data:", { ...dbItem, user_id: userId });
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert(dbItem)
      .select();
      
    if (error) {
      // Rollback transaction on error
      await transactionService.rollbackTransaction();
      console.error('Error creating menu item:', error);
      toast({
        title: "Error creating menu item",
        description: error.message,
        variant: "destructive"
      });
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
    try {
      await transactionService.rollbackTransaction();
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
    }
    console.error('Create menu item error:', error);
    throw error;
  }
};

/**
 * Updates an existing menu item
 */
export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
  // Check authentication first
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const errorMsg = "Authentication required to update menu items";
    console.error(errorMsg);
    toast({
      title: "Authentication Required",
      description: "Please sign in to update menu items",
      variant: "destructive"
    });
    throw new Error(errorMsg);
  }

  const userId = session.user.id;
  if (!userId) {
    throw new Error("User ID not available");
  }
  
  const dbUpdates = {
    ...updates,
    allergens: updates.allergens ? stringifyAllergens(updates.allergens) : undefined,
    user_id: userId // Ensure user_id is set for RLS policies
  };
  
  console.log("Updating menu item with data:", { id, ...dbUpdates, user_id: userId });
  
  const { data, error } = await supabase
    .from('menu_items')
    .update(dbUpdates)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating menu item:', error);
    toast({
      title: "Error updating menu item",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  if (!data || data.length === 0) {
    const notFoundError = new Error(`Menu item with ID ${id} not found or you don't have permission to update it`);
    console.error(notFoundError);
    toast({
      title: "Update Failed",
      description: "Menu item not found or you don't have permission to update it",
      variant: "destructive"
    });
    throw notFoundError;
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
  // Check authentication first
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const errorMsg = "Authentication required to delete menu items";
    console.error(errorMsg);
    toast({
      title: "Authentication Required",
      description: "Please sign in to delete menu items",
      variant: "destructive"
    });
    throw new Error(errorMsg);
  }

  console.log("Deleting menu item with ID:", id);
  
  const { error, count } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error deleting menu item:', error);
    toast({
      title: "Error deleting menu item",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  if (count === 0) {
    console.warn(`No menu item with ID ${id} was found or you don't have permission to delete it`);
    toast({
      title: "Delete Warning",
      description: "Menu item not found or you don't have permission to delete it",
      variant: "destructive"
    });
  }
  
  return true;
};
