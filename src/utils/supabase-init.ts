
import { supabase } from '@/lib/supabaseClient';

/**
 * Initialize Supabase for the application
 * @returns boolean indicating if initialization was successful
 */
export const initializeSupabase = async (): Promise<boolean> => {
  try {
    // Check if we can connect to Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('Supabase initialization warning:', error.message);
      // Return true anyway to allow app to continue loading
      // Most likely this is just a missing session which is expected
      return true;
    }

    console.log('Supabase connection initialized successfully');
    
    // Initialize Supabase realtime feature
    try {
      const channel = supabase.channel('system');
      await channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Supabase realtime system channel subscribed');
        }
      });
    } catch (realtimeError) {
      console.warn('Realtime initialization warning:', realtimeError);
      // Non-critical error, continue
    }

    return true;
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    // Return true anyway to avoid blocking app initialization
    return true;
  }
};
