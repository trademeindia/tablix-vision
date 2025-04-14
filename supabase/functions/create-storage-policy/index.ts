
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { bucketName } = await req.json();
    
    if (!bucketName) {
      throw new Error('Missing bucket name');
    }
    
    console.log(`Creating policies for storage bucket: ${bucketName}`);
    
    // Get API keys from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    // Create the Supabase client with service role key
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/create_storage_policies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({ bucket_name: bucketName })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create storage policies: ${errorText}`);
    }
    
    console.log(`Successfully created policies for bucket: ${bucketName}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Storage policies created for bucket: ${bucketName}` 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error creating storage policies:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error creating storage policies' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
