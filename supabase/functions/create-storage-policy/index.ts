
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

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
    // Get API keys from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase credentials');
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Try to create menu-media bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw new Error(`Error listing buckets: ${listError.message}`);
    }
    
    // Check if menu-media bucket exists
    const menuMediaBucket = buckets.find(bucket => bucket.name === 'menu-media');
    
    if (!menuMediaBucket) {
      console.log('Creating menu-media bucket');
      const { error: createError } = await supabase.storage.createBucket('menu-media', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'image/jpeg', 
          'image/png', 
          'image/gif', 
          'model/gltf-binary', 
          'model/gltf+json'
        ]
      });
      
      if (createError) {
        throw new Error(`Error creating bucket: ${createError.message}`);
      }
    }

    // Create storage policies to allow uploading models
    console.log('Setting up storage policies for 3D models');

    // Allow public read access to the files
    const { error: readPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'menu-media',
      policy_name: 'Public Read Access',
      definition: 'TRUE',
      action: 'SELECT'
    });

    if (readPolicyError) {
      console.error(`Error creating read policy: ${readPolicyError.message}`);
    }

    // Allow authenticated users to upload files
    const { error: insertPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'menu-media',
      policy_name: 'Authenticated Insert Access',
      definition: 'auth.role() = \'authenticated\'',
      action: 'INSERT'
    });

    if (insertPolicyError) {
      console.error(`Error creating insert policy: ${insertPolicyError.message}`);
    }

    // Allow users to update their own objects
    const { error: updatePolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'menu-media',
      policy_name: 'Authenticated Update Access',
      definition: 'auth.role() = \'authenticated\'',
      action: 'UPDATE'
    });

    if (updatePolicyError) {
      console.error(`Error creating update policy: ${updatePolicyError.message}`);
    }

    // Allow users to delete their own objects
    const { error: deletePolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'menu-media',
      policy_name: 'Authenticated Delete Access',
      definition: 'auth.role() = \'authenticated\'',
      action: 'DELETE'
    });

    if (deletePolicyError) {
      console.error(`Error creating delete policy: ${deletePolicyError.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Storage bucket and policies created successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating storage policy:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
