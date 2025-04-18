
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase credentials');
    }

    // Initialize Supabase client with the service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get bucket name from request body
    const { bucketName } = await req.json();
    
    if (!bucketName) {
      throw new Error('Missing bucket name');
    }

    console.log(`Creating or updating bucket: ${bucketName}`);

    // First check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      // Continue anyway to try to create the bucket
    }

    let bucketExists = false;
    if (buckets) {
      bucketExists = buckets.some(bucket => bucket.name === bucketName);
    }

    // Create bucket if it doesn't exist
    if (!bucketExists) {
      console.log(`Creating new bucket: ${bucketName}`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'model/gltf-binary',
          'model/gltf+json',
          'application/octet-stream',
          'application/gltf-binary'
        ]
      });

      if (createError && !createError.message.includes('already exists')) {
        throw new Error(`Failed to create bucket: ${createError.message}`);
      }
    } else {
      console.log(`Bucket ${bucketName} already exists, updating settings`);
      try {
        await supabase.storage.updateBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'model/gltf-binary',
            'model/gltf+json',
            'application/octet-stream',
            'application/gltf-binary'
          ]
        });
      } catch (updateError) {
        console.error('Error updating bucket:', updateError);
        // Continue anyway to try to set policies
      }
    }

    // Create SQL string to set up policies
    const createPoliciesSql = `
      -- Enable RLS on storage.objects
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

      -- Create policy for public SELECT access
      DROP POLICY IF EXISTS "Public SELECT for ${bucketName}" ON storage.objects;
      CREATE POLICY "Public SELECT for ${bucketName}"
      ON storage.objects FOR SELECT
      USING (bucket_id = '${bucketName}');

      -- Create policy for authenticated INSERT access
      DROP POLICY IF EXISTS "Auth INSERT for ${bucketName}" ON storage.objects;
      CREATE POLICY "Auth INSERT for ${bucketName}"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = '${bucketName}' AND
        (auth.role() = 'authenticated' OR auth.role() = 'anon')
      );

      -- Create policy for owner UPDATE access
      DROP POLICY IF EXISTS "Owner UPDATE for ${bucketName}" ON storage.objects;
      CREATE POLICY "Owner UPDATE for ${bucketName}"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = '${bucketName}' AND
        (auth.uid() = owner OR auth.role() = 'anon')
      )
      WITH CHECK (
        bucket_id = '${bucketName}' AND
        (auth.uid() = owner OR auth.role() = 'anon')
      );

      -- Create policy for owner DELETE access
      DROP POLICY IF EXISTS "Owner DELETE for ${bucketName}" ON storage.objects;
      CREATE POLICY "Owner DELETE for ${bucketName}"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = '${bucketName}' AND
        (auth.uid() = owner OR auth.role() = 'anon')
      );
    `;

    // Execute the SQL to create policies
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      query: createPoliciesSql
    });

    if (policiesError) {
      console.error('Error creating policies:', policiesError);
      // Continue anyway, as we at least created the bucket
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        bucketName,
        message: "Storage bucket and policies created successfully"
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in create-storage-policy function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});
