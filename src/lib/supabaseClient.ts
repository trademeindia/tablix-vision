import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://new-project-id.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'new-anon-key'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://new-project-id.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'new-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const getSupabaseUrl = () => {
  return supabaseUrl;
}