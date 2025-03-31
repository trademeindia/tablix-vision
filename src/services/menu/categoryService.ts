
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory } from "@/types/menu";

/**
 * Fetches menu categories for a specific restaurant or all categories if no restaurant ID is provided
 */
export const fetchMenuCategories = async (restaurant_id?: string) => {
  try {
    let query = supabase
      .from('menu_categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (restaurant_id) {
      query = query.eq('restaurant_id', restaurant_id);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching menu categories:', error);
      throw error;
    }
    
    console.log('Menu categories fetched:', data && data.length);
    return data || [];
  } catch (error) {
    console.error('Error in fetchMenuCategories:', error);
    throw error;
  }
};

/**
 * Creates a new menu category
 */
export const createMenuCategory = async (category: Partial<MenuCategory>) => {
  // Ensure required fields are present
  if (!category.name) {
    throw new Error("Category name is required");
  }
  
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
};

/**
 * Updates an existing menu category
 */
export const updateMenuCategory = async (id: string, updates: Partial<MenuCategory>) => {
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
};

/**
 * Deletes a menu category by ID
 */
export const deleteMenuCategory = async (id: string) => {
  const { error } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting menu category:', error);
    throw error;
  }
  
  return true;
};
