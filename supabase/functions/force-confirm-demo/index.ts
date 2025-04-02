
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from './cors.ts'
import { 
  ensureDemoUser, 
  forceConfirmUserEmail,
  fallbackEmailConfirmation 
} from './user-management.ts'
import { ensureDemoData } from './data-setup.ts'

// Force-confirm demo account email and ensure demo data is set up
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('force-confirm-demo function called')
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
    
    // Ensure demo user exists or create if needed
    const demoUser = await ensureDemoUser(supabaseAdmin, demoEmail)
    
    // Force confirm email regardless of sign-in outcome
    let confirmSuccess = false
    
    if (demoUser?.id) {
      confirmSuccess = await forceConfirmUserEmail(supabaseAdmin, demoUser.id)
      
      if (!confirmSuccess) {
        // Try fallback methods if admin API fails
        confirmSuccess = await fallbackEmailConfirmation(supabaseAdmin, demoEmail)
      }
    }
    
    // Ensure demo account has a restaurant and data
    await ensureDemoData(supabaseAdmin, demoEmail)
    
    return new Response(
      JSON.stringify({ 
        data: { success: true, message: 'Demo account email confirmed and data prepared' },
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
