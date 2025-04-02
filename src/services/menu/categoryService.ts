
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory } from "@/types/menu";
import { getErrorMessage } from "@/utils/api-helpers";

// Menu Categories
export const fetchMenuCategories = async (restaurant_id?: string) => {
  try {
    console.log("Fetching menu categories for restaurant:", restaurant_id);
    
    if (!restaurant_id) {
      console.error("Restaurant ID is required");
      return [];
    }
    
    let query = supabase
      .from('menu_categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    query = query.eq('restaurant_id', restaurant_id);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching menu categories:', error);
      throw error;
    }
    
    console.log('Menu categories fetched:', data?.length || 0);
    if (data?.length === 0) {
      console.log("No categories found for restaurant:", restaurant_id);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchMenuCategories:', getErrorMessage(error));
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

export const createMenuCategory = async (category: Partial<MenuCategory>) => {
  // Ensure required fields are present
  if (!category.name) {
    throw new Error("Category name is required");
  }
  
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert({
        name: category.name,
        description: category.description,
        display_order: category.display_order,
        restaurant_id: category.restaurant_id,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select();
      
    if (error) {
      console.error('Error creating menu category:', error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error in createMenuCategory:', getErrorMessage(error));
    throw error;
  }
};

export const updateMenuCategory = async (id: string, updates: Partial<MenuCategory>) => {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error updating menu category:', error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error in updateMenuCategory:', getErrorMessage(error));
    throw error;
  }
};

export const deleteMenuCategory = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting menu category:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMenuCategory:', getErrorMessage(error));
    throw error;
  }
};
