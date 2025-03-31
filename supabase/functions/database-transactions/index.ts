
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Parse request
  const url = new URL(req.url);
  const action = url.pathname.split('/').pop();

  try {
    let result;
    
    if (action === 'begin_transaction') {
      // Begin a transaction
      await supabase.rpc('begin_transaction');
      result = { success: true, message: 'Transaction started' };
    } 
    else if (action === 'commit_transaction') {
      // Commit a transaction
      await supabase.rpc('commit_transaction');
      result = { success: true, message: 'Transaction committed' };
    } 
    else if (action === 'rollback_transaction') {
      // Rollback a transaction
      await supabase.rpc('rollback_transaction');
      result = { success: true, message: 'Transaction rolled back' };
    } 
    else {
      throw new Error('Unknown action');
    }

    // Return success response
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(`Error in ${action} function:`, error);
    
    // Return error response
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
