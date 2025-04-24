
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, parseAllergens } from "@/types/menu";
import { getErrorMessage } from "@/utils/api-helpers";

export const fetchMenuItems = async (category_id?: string, restaurant_id?: string): Promise<MenuItem[]> => {
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
    throw error;
  }
};

