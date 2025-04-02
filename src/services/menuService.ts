import { supabase } from "@/integrations/supabase/client";
import { MenuCategory, MenuItem, parseAllergens, stringifyAllergens } from "@/types/menu";
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
    
    return data ? data.map(item => ({
      ...item,
      allergens: parseAllergens(item.allergens)
    })) : [];
  } catch (error) {
    console.error('Error in fetchMenuItems:', getErrorMessage(error));
    // Return empty array instead of throwing to prevent app crashes
    return [];
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
      console.error('Error creating menu item:', error);
      throw error;
    }
    
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

// Helper function to generate test data if needed
export const generateTestMenuData = (restaurant_id: string): { categories: MenuCategory[], items: MenuItem[] } => {
  console.log("Generating test menu data for restaurant:", restaurant_id);
  
  const categories = [
    {
      id: "cat-1",
      name: "Starters",
      description: "Begin your meal with these delicious options",
      restaurant_id,
      display_order: 1
    },
    {
      id: "cat-2",
      name: "Main Courses",
      description: "Hearty and satisfying main dishes",
      restaurant_id,
      display_order: 2
    },
    {
      id: "cat-3",
      name: "Desserts",
      description: "Sweet treats to finish your meal",
      restaurant_id,
      display_order: 3
    }
  ];
  
  const items = [
    {
      id: "item-1",
      name: "Garlic Bread",
      description: "Freshly baked bread with garlic butter",
      price: 5.99,
      category_id: "cat-1",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["gluten"] }
    },
    {
      id: "item-2",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with Caesar dressing",
      price: 8.99,
      category_id: "cat-1",
      restaurant_id,
      is_available: true,
      allergens: { items: ["eggs", "dairy"] }
    },
    {
      id: "item-3",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce and mozzarella",
      price: 12.99,
      category_id: "cat-2",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["gluten", "dairy"] }
    },
    {
      id: "item-4",
      name: "Chocolate Cake",
      description: "Rich chocolate cake with a molten center",
      price: 7.99,
      category_id: "cat-3",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["gluten", "dairy", "eggs"] }
    }
  ];
  
  return { categories, items };
};
