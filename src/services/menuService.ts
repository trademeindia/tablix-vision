
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory, MenuItem } from "@/types/menu";

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
  const { data, error } = await supabase
    .from('menu_categories')
    .insert(category)
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
  
  return data;
};

export const createMenuItem = async (item: Partial<MenuItem>) => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert(item)
    .select();
    
  if (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
  
  return data[0];
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
  
  return data[0];
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
