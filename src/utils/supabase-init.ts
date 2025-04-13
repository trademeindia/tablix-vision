
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize Supabase when the app starts
 * - Checks auth status
 * - Sets up listeners
 * - Configures storage buckets if needed
 * - Enables realtime functionality for critical tables
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
    await enableRealtimeTables();
    
    // Ensure storage bucket exists with proper policies
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
async function enableRealtimeTables() {
  try {
    // Create dedicated channels for different table groups
    
    // 1. Channel for tables status updates
    const tablesChannel = supabase.channel('tables-status-updates')
      .on('postgres_changes', {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'tables'
      }, (payload) => {
        console.log('Table status changed:', payload);
        // Event will be handled by components that subscribe to this channel
      })
      .subscribe((status) => {
        console.log('Tables channel status:', status);
      });
    
    // 2. Channel for orders updates
    const ordersChannel = supabase.channel('orders-updates')
      .on('postgres_changes', {
        event: '*', // Listen for all events
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('Order changed:', payload);
        // Event will be handled by components that subscribe to this channel
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_items'
      }, (payload) => {
        console.log('Order item changed:', payload);
        // Event will be handled by components that subscribe to this channel
      })
      .subscribe((status) => {
        console.log('Orders channel status:', status);
      });
      
    // 3. Channel for menu updates (optional, only if menu changes should be real-time)
    const menuChannel = supabase.channel('menu-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'menu_items',
        filter: 'is_available=eq.true' // Only listen for available items
      }, (payload) => {
        console.log('Menu item changed:', payload);
        // Event will be handled by components that subscribe to this channel
      })
      .subscribe((status) => {
        console.log('Menu channel status:', status);
      });
    
    console.log('Realtime enabled for critical tables');
    
    // We don't unsubscribe as these are application-level subscriptions
    // that should remain active throughout the application lifecycle
    
    return { tablesChannel, ordersChannel, menuChannel };
  } catch (err) {
    console.error('Failed to enable realtime:', err);
    return null;
  }
}

/**
 * Ensure the storage bucket exists with proper configuration
 */
async function ensureStorageBucket() {
  try {
    // First try to directly call the edge function
    try {
      const response = await supabase.functions.invoke('create-storage-policy', {
        body: { bucketName: 'menu-media' }
      });
      console.log('Storage policies initialized through edge function:', response);
      return true;
    } catch (e) {
      console.log('Edge function call failed, trying direct storage API:', e);
    }
    
    // Check if our bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking storage buckets:', error);
      return false;
    }
    
    const menuMediaBucket = buckets.find(bucket => bucket.name === 'menu-media');
    
    if (!menuMediaBucket) {
      console.log('The menu-media bucket was not found. Creating it...');
      
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('menu-media', {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        if (createError.message?.includes('already exists')) {
          console.log('Bucket already exists but was not found in listBuckets. This is likely a permissions issue.');
          return true;
        } else {
          console.error('Error creating menu-media bucket:', createError);
          return false;
        }
      }
      
      console.log('Successfully created menu-media bucket');
      
      // Try to call the edge function again now that the bucket exists
      try {
        const response = await supabase.functions.invoke('create-storage-policy', {
          body: { bucketName: 'menu-media' }
        });
        console.log('Storage policies initialized through edge function after bucket creation:', response);
      } catch (rlsError) {
        console.error('Error setting up policies via edge function:', rlsError);
      }
    } else {
      console.log('menu-media bucket exists');
    }
    
    return true;
  } catch (err) {
    console.error('Error ensuring storage bucket:', err);
    return false;
  }
}
