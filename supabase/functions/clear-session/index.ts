
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../upload-model/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Set cookie clearing headers
    const headers = new Headers(corsHeaders);
    headers.append('Set-Cookie', 'sb-access-token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax');
    headers.append('Set-Cookie', 'sb-refresh-token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax');
    
    return new Response(
      JSON.stringify({ 
        data: { success: true },
        error: null
      }),
      { 
        headers, 
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        data: null, 
        error: error.message 
      }),
      { 
        headers: corsHeaders, 
        status: 400 
      }
    )
  }
})
