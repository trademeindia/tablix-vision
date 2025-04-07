
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

export async function getRestaurantFolderId(
  supabase: SupabaseClient,
  restaurantId: string
): Promise<string> {
  console.log(`Fetching Google Drive folder ID for restaurant: ${restaurantId}`);
  
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('google_drive_folder_id')
      .eq('id', restaurantId)
      .single();
    
    if (error) {
      console.error("Error fetching restaurant folder ID:", error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data || !data.google_drive_folder_id) {
      console.error("Restaurant has no Google Drive folder ID configured");
      // Fallback to default folder (for demo purposes)
      return "1MLcXF4zW2yrn_PB1ClAH_CfCk7jSGE23";
    }
    
    console.log(`Found folder ID: ${data.google_drive_folder_id}`);
    return data.google_drive_folder_id;
  } catch (error) {
    console.error("Error in getRestaurantFolderId:", error);
    // Fallback to default folder (for demo purposes)
    return "1MLcXF4zW2yrn_PB1ClAH_CfCk7jSGE23";
  }
}

export async function updateMenuItem(
  supabase: SupabaseClient,
  menuItemId: string, 
  fileId: string, 
  fileUrl: string
): Promise<void> {
  console.log(`Updating menu item ${menuItemId} with file ID ${fileId} and URL ${fileUrl}`);
  
  try {
    if (menuItemId === 'new-item') {
      console.log("New item, will be updated during item creation");
      return;
    }
    
    const { error } = await supabase
      .from('menu_items')
      .update({
        media_reference: fileId,
        model_url: fileUrl,
        media_type: '3d'
      })
      .eq('id', menuItemId);
    
    if (error) {
      console.error("Error updating menu item:", error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log(`Successfully updated menu item ${menuItemId}`);
  } catch (error) {
    console.error("Error in updateMenuItem:", error);
    throw error;
  }
}
