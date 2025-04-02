
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../upload-model/cors.ts'

// Force-confirm demo account email
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key which has admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Demo account email
    const demoEmail = 'demo@restaurant.com'
    
    // Find demo user by email
    const { data: users, error: userError } = await supabaseAdmin
      .from('auth.users')
      .select('id, email, email_confirmed_at, is_confirmed')
      .eq('email', demoEmail)
      .maybeSingle()
    
    if (userError) {
      console.error('Error finding demo user:', userError)
      throw new Error('Failed to find demo user')
    }
    
    if (!users) {
      console.error('Demo user not found')
      throw new Error('Demo user not found')
    }
    
    console.log('Found demo user:', users)
    
    // Force confirm email if not already confirmed
    if (!users.is_confirmed || !users.email_confirmed_at) {
      const now = new Date().toISOString()
      
      // Update directly in auth.users table
      const { error: updateError } = await supabaseAdmin
        .from('auth.users')
        .update({
          email_confirmed_at: now,
          confirmed_at: now,
          is_confirmed: true
        })
        .eq('email', demoEmail)
      
      if (updateError) {
        console.error('Error confirming demo user:', updateError)
        throw new Error('Failed to confirm demo user email')
      }
      
      console.log('Successfully confirmed demo user email')
    } else {
      console.log('Demo user already confirmed')
    }
    
    return new Response(
      JSON.stringify({ 
        data: { success: true, message: 'Demo account email confirmed' },
        error: null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in force-confirm-demo:', error)
    
    return new Response(
      JSON.stringify({ 
        data: null, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
