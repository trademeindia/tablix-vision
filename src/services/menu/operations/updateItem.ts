
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, stringifyAllergens } from "@/types/menu";
import { getErrorMessage } from "@/utils/api-helpers";

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
  try {
    console.log("Updating menu item:", id, updates);
    
    let userId;
    try {
      userId = (await supabase.auth.getUser()).data.user?.id;
    } catch (authError) {
      console.warn("User authentication error, using default ID:", authError);
      userId = "00000000-0000-0000-0000-000000000000";
    }
    
    if (!userId) {
      console.warn("No user ID found, using default");
      userId = "00000000-0000-0000-0000-000000000000";
    }
    
    const parsedUpdates = { ...updates };
    if (parsedUpdates.price !== undefined) {
      parsedUpdates.price = parseFloat(parsedUpdates.price.toString());
    }
    
    const dbUpdates = {
      ...parsedUpdates,
      allergens: updates.allergens ? stringifyAllergens(updates.allergens) : undefined,
      user_id: userId,
      updated_at: new Date().toISOString()
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
    
    if (!data || data.length === 0) {
      throw new Error('No item found to update with ID: ' + id);
    }
    
    console.log("Menu item updated successfully:", data[0]);
    
    // Convert the database response back to a MenuItem type
    const updatedItem: MenuItem = {
      ...data[0],
      allergens: updates.allergens || undefined
    };
    
    return updatedItem;
  } catch (error) {
    console.error('Error in updateMenuItem:', getErrorMessage(error));
    throw error;
  }
};

