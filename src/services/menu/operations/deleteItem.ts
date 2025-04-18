
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/utils/api-helpers";

export const deleteMenuItem = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting menu item:", id);
    
    const { data: item, error: getError } = await supabase
      .from('menu_items')
      .select('media_reference, image_url, model_url')
      .eq('id', id)
      .single();
    
    if (getError) {
      console.warn('Error fetching menu item for deletion:', getError);
    } else if (item) {
      try {
        if (item.media_reference) {
          console.log("Attempting to delete stored media:", item.media_reference);
        }
      } catch (mediaError) {
        console.warn('Error cleaning up media files:', mediaError);
      }
    }
    
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
    
    console.log("Menu item deleted successfully");
    return true;
  } catch (error) {
    console.error('Error in deleteMenuItem:', getErrorMessage(error));
    throw error;
  }
};

