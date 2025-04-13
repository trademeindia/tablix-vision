
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

    // Parse request body
    const { bucketName } = await req.json();
    if (!bucketName) {
      throw new Error('Missing bucketName parameter');
    }

    // Try to create bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw new Error(`Error listing buckets: ${listError.message}`);
    }
    
    // Check if bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating bucket ${bucketName}`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
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

    // Set up storage policies directly with SQL
    const { error: policyError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Allow public read access to files
        BEGIN;
          DROP POLICY IF EXISTS "Public Read Access for ${bucketName}" ON storage.objects;
          CREATE POLICY "Public Read Access for ${bucketName}"
          ON storage.objects FOR SELECT
          USING (bucket_id = '${bucketName}');
            
          -- Allow authenticated users to upload files
          DROP POLICY IF EXISTS "Auth Users can upload to ${bucketName}" ON storage.objects;
          CREATE POLICY "Auth Users can upload to ${bucketName}"
          ON storage.objects FOR INSERT
          WITH CHECK (bucket_id = '${bucketName}' AND auth.role() = 'authenticated');
            
          -- Allow users to update their own objects
          DROP POLICY IF EXISTS "Users can update own objects in ${bucketName}" ON storage.objects;
          CREATE POLICY "Users can update own objects in ${bucketName}"
          ON storage.objects FOR UPDATE
          USING (bucket_id = '${bucketName}' AND auth.uid() = owner)
          WITH CHECK (bucket_id = '${bucketName}' AND auth.uid() = owner);
            
          -- Allow users to delete their own objects
          DROP POLICY IF EXISTS "Users can delete own objects in ${bucketName}" ON storage.objects;
          CREATE POLICY "Users can delete own objects in ${bucketName}"
          ON storage.objects FOR DELETE
          USING (bucket_id = '${bucketName}' AND auth.uid() = owner);
        COMMIT;
      `
    });

    if (policyError) {
      throw new Error(`Error setting up storage policies: ${policyError.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Storage bucket '${bucketName}' and policies created successfully`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in create-storage-policy:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
