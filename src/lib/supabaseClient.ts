
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qofbpjdbmisyxysfcyeb.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZmJwamRibWlzeXh5c2ZjeWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTUxMzIsImV4cCI6MjA1ODQ5MTEzMn0.RqUyHPLxCWUATAufUkXCUN9yczZNBKMQD_wYF4Q3VVA'

// Create Supabase client with explicit configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-application-name': 'menu360'
    }
  }
})

// Helper function to get the Supabase URL
export const getSupabaseUrl = () => {
  return supabaseUrl;
}

// Helper function to safely get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Helper function for secure storage operations
export const getPublicUrl = (bucket: string, path: string) => {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error('Error generating public URL:', error);
    return null;
  }
}
