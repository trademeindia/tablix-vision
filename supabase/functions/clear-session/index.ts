
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from './cors.ts'

// Edge function to clear session cookies
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('clear-session function called')
    
    // Create cookie clearing headers with past expiration
    const cookieClearingHeaders = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Set-Cookie': [
        'sb-access-token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
        'sb-refresh-token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax'
      ].join(', ')
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Session cookies cleared' 
      }),
      { 
        headers: cookieClearingHeaders,
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in clear-session:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
