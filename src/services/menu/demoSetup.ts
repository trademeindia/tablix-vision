
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures a demo restaurant exists in the database
 * This is necessary for the demo mode to work properly with foreign key constraints
 */
export const ensureDemoRestaurantExists = async (): Promise<string> => {
  try {
    // Default restaurant ID for demo mode
    const demoRestaurantId = "00000000-0000-0000-0000-000000000000";
    
    // Check if the demo restaurant already exists
    const { data: existingRestaurant, error: fetchError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('id', demoRestaurantId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking for demo restaurant:', fetchError);
    }
    
    // If the restaurant already exists, return its ID
    if (existingRestaurant) {
      console.log('Demo restaurant already exists:', demoRestaurantId);
      return demoRestaurantId;
    }
    
    // Create the demo restaurant
    console.log('Creating demo restaurant with ID:', demoRestaurantId);
    const { error: insertError } = await supabase
      .from('restaurants')
      .insert({
        id: demoRestaurantId,
        name: 'Demo Restaurant',
        description: 'This is a demo restaurant for testing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error('Error creating demo restaurant:', insertError);
      throw insertError;
    }
    
    console.log('Demo restaurant created successfully');
    return demoRestaurantId;
  } catch (error) {
    console.error('Error in ensureDemoRestaurantExists:', error);
    throw error;
  }
};
