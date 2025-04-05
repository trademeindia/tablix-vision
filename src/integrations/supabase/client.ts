
import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qofbpjdbmisyxysfcyeb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZmJwamRibWlzeXh5c2ZjeWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTUxMzIsImV4cCI6MjA1ODQ5MTEzMn0.RqUyHPLxCWUATAufUkXCUN9yczZNBKMQD_wYF4Q3VVA';

if (!supabaseUrl || supabaseKey === 'fallback-key') {
  console.warn('Missing or invalid Supabase environment variables. Using fallback values.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Debug Supabase connection
console.log('Supabase client initialized with URL:', supabaseUrl);

// Test the connection on initialization
supabase.auth.getSession()
  .then(() => console.log('Supabase connection successful'))
  .catch(error => console.error('Supabase connection error:', error));
