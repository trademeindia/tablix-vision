
// Database operations for the upload model function
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

export async function getRestaurantFolderId(supabase: any, restaurantId: string) {
  console.log(`Fetching folder ID for restaurant: ${restaurantId}`);
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('google_drive_folder_id')
      .eq('id', restaurantId)
      .single();

    if (error) {
      console.error('Error fetching restaurant folder ID:', error);
      throw new Error(`Failed to get Google Drive folder ID: ${error.message}`);
    }

    if (!data || !data.google_drive_folder_id) {
      throw new Error('Restaurant does not have a Google Drive folder configured');
    }

    console.log(`Found folder ID: ${data.google_drive_folder_id}`);
    return data.google_drive_folder_id;
  } catch (error) {
    console.error('Error in getRestaurantFolderId:', error.message);
    throw error;
  }
}

export async function updateMenuItem(supabase: any, menuItemId: string, fileId: string, fileUrl: string) {
  console.log(`Updating menu item ${menuItemId} with file ID ${fileId}`);
  try {
    // Skip updating for new items (they'll be created with this info)
    if (menuItemId === 'new-item') {
      console.log('Skipping database update for new item');
      return { success: true };
    }
    
    const { error } = await supabase
      .from('menu_items')
      .update({
        media_type: '3d',
        media_reference: fileId,
        model_url: fileUrl
      })
      .eq('id', menuItemId);

    if (error) {
      console.error('Error updating menu item:', error);
      throw new Error(`Failed to update menu item with file ID: ${error.message}`);
    }

    console.log('Menu item successfully updated');
    return { success: true };
  } catch (error) {
    console.error('Error in updateMenuItem:', error.message);
    throw error;
  }
}
