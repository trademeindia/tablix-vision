
// Supabase Edge Function for handling integration syncing
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { integration_id, entity, direction } = body;

    if (!integration_id) {
      return new Response(
        JSON.stringify({ error: 'integration_id is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Syncing integration ${integration_id}`, { entity, direction });

    // Get integration details
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integration_id)
      .single();

    if (integrationError) {
      console.error('Error fetching integration:', integrationError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch integration details' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get integration credentials
    const { data: credentials, error: credentialsError } = await supabase
      .from('integration_credentials')
      .select('key, value')
      .eq('integration_id', integration_id);

    if (credentialsError) {
      console.error('Error fetching credentials:', credentialsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch integration credentials' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get sync configurations
    const { data: syncConfigs, error: syncConfigsError } = await supabase
      .from('integration_sync_configs')
      .select('config')
      .eq('integration_id', integration_id);

    if (syncConfigsError) {
      console.error('Error fetching sync configs:', syncConfigsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch sync configurations' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Organize credentials into a key-value map
    const credentialsMap = credentials.reduce((acc, credential) => {
      acc[credential.key] = credential.value;
      return acc;
    }, {} as Record<string, string>);

    // Process each sync configuration
    const results = [];
    const filteredConfigs = syncConfigs
      .map(record => record.config)
      .filter(config => 
        (!entity || config.entity === entity) && 
        (!direction || config.direction === direction || config.direction === 'bidirectional')
      );

    // TODO: Implement actual API calls to the third-party services
    // This is a placeholder for demonstration
    for (const config of filteredConfigs) {
      console.log(`Processing sync config for entity: ${config.entity}, direction: ${config.direction}`);
      
      // Simulate an API call with some delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      results.push({
        entity: config.entity,
        direction: config.direction,
        status: 'success',
        timestamp: new Date().toISOString(),
      });
    }

    // Update the lastSynced timestamp for the integration
    await supabase
      .from('integrations')
      .update({ last_synced: new Date().toISOString() })
      .eq('id', integration_id);

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error processing sync request:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process sync request', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
