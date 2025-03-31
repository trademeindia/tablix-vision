import { supabase } from "@/integrations/supabase/client";
import { MenuCategory } from "@/types/menu";
import { toast } from "@/hooks/use-toast";

/**
 * Fetches menu categories for a specific restaurant or all categories if no restaurant ID is provided
 */
export const fetchMenuCategories = async (restaurant_id?: string) => {
  try {
    // First check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn('User not authenticated in fetchMenuCategories');
      // For public access, we can proceed but log a warning
    }
    
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
      toast({
        title: "Error fetching menu categories",
        description: error.message,
        variant: "destructive"
      });
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
  // Check authentication first
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const errorMsg = "Authentication required to create menu categories";
    console.error(errorMsg);
    toast({
      title: "Authentication Required",
      description: "Please sign in to create menu categories",
      variant: "destructive"
    });
    throw new Error(errorMsg);
  }

  // Ensure required fields are present
  if (!category.name) {
    throw new Error("Category name is required");
  }
  
  const userId = session.user.id;
  if (!userId) {
    throw new Error("User ID not available");
  }

  console.log("Creating menu category with data:", {
    ...category,
    user_id: userId
  });
  
  const { data, error } = await supabase
    .from('menu_categories')
    .insert({
      name: category.name,
      description: category.description,
      display_order: category.display_order || 0,
      restaurant_id: category.restaurant_id,
      user_id: userId
    })
    .select();
    
  if (error) {
    console.error('Error creating menu category:', error);
    toast({
      title: "Error creating menu category",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  return data[0];
};

/**
 * Updates an existing menu category
 */
export const updateMenuCategory = async (id: string, updates: Partial<MenuCategory>) => {
  // Check authentication first
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const errorMsg = "Authentication required to update menu categories";
    console.error(errorMsg);
    toast({
      title: "Authentication Required",
      description: "Please sign in to update menu categories",
      variant: "destructive"
    });
    throw new Error(errorMsg);
  }

  const userId = session.user.id;
  if (!userId) {
    throw new Error("User ID not available");
  }

  // Ensure user_id is set for RLS policies
  const updateData = {
    ...updates,
    user_id: userId
  };

  console.log("Updating menu category with data:", {
    id,
    ...updateData
  });
  
  const { data, error } = await supabase
    .from('menu_categories')
    .update(updateData)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating menu category:', error);
    toast({
      title: "Error updating menu category",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  if (!data || data.length === 0) {
    const notFoundError = new Error(`Category with ID ${id} not found or you don't have permission to update it`);
    console.error(notFoundError);
    toast({
      title: "Update Failed",
      description: "Category not found or you don't have permission to update it",
      variant: "destructive"
    });
    throw notFoundError;
  }
  
  return data[0];
};

/**
 * Deletes a menu category by ID
 */
export const deleteMenuCategory = async (id: string) => {
  // Check authentication first
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const errorMsg = "Authentication required to delete menu categories";
    console.error(errorMsg);
    toast({
      title: "Authentication Required",
      description: "Please sign in to delete menu categories",
      variant: "destructive"
    });
    throw new Error(errorMsg);
  }

  console.log("Deleting menu category with ID:", id);
  
  const { error, count } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error deleting menu category:', error);
    toast({
      title: "Error deleting menu category",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  if (count === 0) {
    console.warn(`No category with ID ${id} was found or you don't have permission to delete it`);
    toast({
      title: "Delete Warning",
      description: "Category not found or you don't have permission to delete it",
      variant: "destructive"
    });
  }
  
  return true;
};
