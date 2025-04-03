
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Initialize Supabase client with service role key (has admin rights)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the bucket name from the request payload
    const { bucket_name } = await req.json();

    if (!bucket_name) {
      throw new Error('Missing bucket_name parameter');
    }

    console.log(`Creating policies for bucket: ${bucket_name}`);

    // Create a policy to allow public read access to the bucket
    const { error: policyReadError } = await supabase.rpc('create_read_policy_for_bucket', { 
      bucket_name 
    });

    if (policyReadError) {
      console.error('Error creating read policy:', policyReadError);
      throw policyReadError;
    }

    // Create a policy to allow authenticated users to insert into the bucket
    const { error: policyInsertError } = await supabase.rpc('create_insert_policy_for_bucket', { 
      bucket_name 
    });

    if (policyInsertError) {
      console.error('Error creating insert policy:', policyInsertError);
      throw policyInsertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Storage policies created for bucket: ${bucket_name}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
