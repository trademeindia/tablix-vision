
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize Supabase when the app starts
 * - Checks auth status
 * - Sets up listeners
 * - Configures storage buckets if needed
 */
export async function initializeSupabase() {
  console.log('Initializing Supabase...');
  
  try {
    // Verify the connection
    const { data, error } = await supabase.from('restaurants').select('count').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    
    console.log('Successfully connected to Supabase');
    
    // Check auth status
    const { data: authData } = await supabase.auth.getSession();
    if (authData?.session) {
      console.log('User is authenticated');
    } else {
      console.log('No authenticated user');
    }
    
    // Enable realtime for critical tables
    enableRealtimeTables();
    
    // Ensure storage bucket exists
    await ensureStorageBucket();
    
    return true;
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
    return false;
  }
}

/**
 * Enable realtime for critical tables
 */
function enableRealtimeTables() {
  try {
    // Create a channel for restaurant tables
    supabase.channel('db-tables-status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tables'
      }, (payload) => {
        console.log('Table status changed:', payload);
      })
      .subscribe();
    
    console.log('Realtime enabled for tables');
  } catch (err) {
    console.error('Failed to enable realtime:', err);
  }
}

/**
 * Ensure the storage bucket exists
 */
async function ensureStorageBucket() {
  try {
    // Check if our bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking storage buckets:', error);
      return;
    }
    
    const menuMediaBucket = buckets.find(bucket => bucket.name === 'menu-media');
    
    if (!menuMediaBucket) {
      console.log('The menu-media bucket was not found. It should be created via SQL migrations.');
    } else {
      console.log('menu-media bucket exists');
    }
  } catch (err) {
    console.error('Error ensuring storage bucket:', err);
  }
}
