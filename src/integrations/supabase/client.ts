
import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fallback-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'fallback-key';

if (!supabaseUrl || supabaseKey === 'fallback-key') {
  console.warn('Missing or invalid Supabase environment variables. Using fallback values for development.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Debug Supabase connection
console.log('Supabase client initialized with URL:', supabaseUrl.includes('fallback') ? 'Using fallback URL' : 'Using configured URL');
