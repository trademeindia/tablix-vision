
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Get Google Drive credentials from environment
    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const GOOGLE_REFRESH_TOKEN = Deno.env.get("GOOGLE_REFRESH_TOKEN");
    
    // Check if all required credentials exist
    const hasCredentials = !!GOOGLE_CLIENT_ID && !!GOOGLE_CLIENT_SECRET && !!GOOGLE_REFRESH_TOKEN;
    
    console.log(`Checking Google Drive credentials: ${hasCredentials ? 'All present' : 'Some missing'}`);
    
    // Return the status
    return new Response(
      JSON.stringify({ 
        hasCredentials, 
        clientIdExists: !!GOOGLE_CLIENT_ID,
        clientSecretExists: !!GOOGLE_CLIENT_SECRET,
        refreshTokenExists: !!GOOGLE_REFRESH_TOKEN
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error('Error checking credentials:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal Server Error',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
