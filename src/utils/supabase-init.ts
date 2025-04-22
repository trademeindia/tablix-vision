
import { supabase } from '@/integrations/supabase/client';
import { initializeStorage } from '@/hooks/menu/use-create-storage-bucket';

/**
 * Initialize Supabase connection and create necessary buckets
 */
export const initializeSupabase = async (): Promise<boolean> => {
  try {
    console.log('Initializing Supabase connection...');
    
    // Test connection by checking user session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    
    // Initialize storage bucket for menu media
    const storageInitialized = await initializeStorage();
    console.log('Storage initialization:', storageInitialized ? 'successful' : 'failed');
    
    return true;
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
    return false;
  }
};
