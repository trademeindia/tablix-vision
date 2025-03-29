
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory, MenuItem, parseAllergens, stringifyAllergens } from "@/types/menu";

// Menu Categories
export const fetchMenuCategories = async (restaurant_id?: string) => {
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
  
  return data;
};

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
      restaurant_id: category.restaurant_id
    })
    .select();
    
  if (error) {
    console.error('Error creating menu category:', error);
    throw error;
  }
  
  return data[0];
};

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

// Menu Items
export const fetchMenuItems = async (category_id?: string, restaurant_id?: string) => {
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
  
  return data.map(item => ({
    ...item,
    allergens: parseAllergens(item.allergens)
  }));
};

export const createMenuItem = async (item: Partial<MenuItem>) => {
  // Ensure required fields are present
  if (!item.name) {
    throw new Error("Item name is required");
  }
  
  if (item.price === undefined || item.price === null) {
    throw new Error("Item price is required");
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
    restaurant_id: item.restaurant_id
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
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
  const dbUpdates = {
    ...updates,
    allergens: updates.allergens ? stringifyAllergens(updates.allergens) : undefined
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
