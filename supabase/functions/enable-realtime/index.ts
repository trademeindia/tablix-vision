
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL or service key is missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the request body
    const { tables } = await req.json();

    if (!Array.isArray(tables) || tables.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid tables array provided' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Enable replica identity full and add to supabase_realtime publication
    const results = await Promise.all(
      tables.map(async (tableName) => {
        try {
          // First, set replica identity full
          const { error: replicaError } = await supabase.rpc('admin_set_replica_identity_full', { 
            table_name: tableName 
          });
          
          if (replicaError) {
            console.error(`Error setting replica identity for ${tableName}:`, replicaError);
            return {
              table: tableName,
              replicaSuccess: false,
              replicaError: replicaError.message,
            };
          }
          
          // Then, add to realtime publication
          const { error: pubError } = await supabase.rpc('admin_add_table_to_publication', { 
            table_name: tableName 
          });
          
          if (pubError) {
            console.error(`Error adding ${tableName} to publication:`, pubError);
            return {
              table: tableName,
              replicaSuccess: true,
              pubSuccess: false,
              pubError: pubError.message,
            };
          }
          
          return {
            table: tableName,
            success: true,
          };
        } catch (error) {
          console.error(`Error enabling realtime for ${tableName}:`, error);
          return {
            table: tableName,
            success: false,
            error: error.message,
          };
        }
      })
    );

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in enable-realtime function:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
