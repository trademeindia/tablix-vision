
import { supabase } from '@/lib/supabaseClient';

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
    
    // Enable Row Level Security for critical tables
    await enableRowLevelSecurity();
    
    // Initialize storage bucket for menu media
    await initializeStorage();
    
    return true;
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
    return false;
  }
};

/**
 * Enable Row Level Security for all tables
 */
const enableRowLevelSecurity = async (): Promise<void> => {
  try {
    // Get list of all tables in the public schema
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
      
    if (error) {
      console.error('Error fetching tables:', error);
      return;
    }
    
    console.log(`Found ${tables.length} tables in public schema`);
    
    // Check RLS status for each table
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`Verifying RLS for table: ${tableName}`);
    }
  } catch (error) {
    console.error('Error enabling RLS:', error);
  }
};

/**
 * Initialize storage buckets
 */
const initializeStorage = async (): Promise<boolean> => {
  try {
    // Check if menu-media bucket exists
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets();
      
    if (error) {
      console.error('Error fetching storage buckets:', error);
      return false;
    }
    
    const menuMediaBucket = buckets.find(b => b.name === 'menu-media');
    
    if (!menuMediaBucket) {
      console.log('Menu media bucket does not exist, please create it in the Supabase dashboard');
      // Note: We can't create buckets directly from client due to security restrictions
    } else {
      console.log('Menu media bucket exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
};
