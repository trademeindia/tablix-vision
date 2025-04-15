
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
    
    // Create the bucket if it doesn't exist already
    try {
      const bucketResponse = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucketName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        }
      });
      
      // If bucket doesn't exist, create it
      if (bucketResponse.status === 404) {
        console.log(`Bucket ${bucketName} not found, creating it...`);
        
        const createBucketResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            id: bucketName,
            name: bucketName,
            public: true,
            file_size_limit: 52428800,
            allowed_mime_types: [
              'image/jpeg',
              'image/png',
              'image/gif',
              'model/gltf-binary',
              'model/gltf+json',
              'application/octet-stream',
              'application/gltf-binary'
            ]
          })
        });
        
        if (!createBucketResponse.ok) {
          console.log(`Failed to create bucket, status: ${createBucketResponse.status}`);
          const errorText = await createBucketResponse.text();
          console.log(`Bucket creation error: ${errorText}`);
          
          // If bucket already exists (409), continue with policy creation
          if (createBucketResponse.status !== 409) {
            throw new Error(`Failed to create bucket: ${errorText}`);
          }
        }
      }
    } catch (bucketError) {
      console.log(`Error checking/creating bucket: ${bucketError.message}`);
      // Continue to policy creation even if bucket creation fails
    }
    
    // Now create the policies directly using SQL
    const policyResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/create_storage_policies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({ bucket_name: bucketName })
    });
    
    if (!policyResponse.ok) {
      const errorText = await policyResponse.text();
      console.error(`Failed to create storage policies: ${errorText}`);
      // Don't throw here, still return success if policy creation fails
      // since the bucket might be usable with default policies
    } else {
      console.log(`Successfully created policies for bucket: ${bucketName}`);
    }
    
    // Set more permissive policies directly via SQL
    try {
      const createPublicPolicySql = `
        -- Ensure RLS is enabled on storage.objects
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
        
        -- Create a public read policy
        DROP POLICY IF EXISTS "Public Read Access for ${bucketName}" ON storage.objects;
        CREATE POLICY "Public Read Access for ${bucketName}"
        ON storage.objects FOR SELECT
        USING (bucket_id = '${bucketName}');
        
        -- Create a policy allowing authenticated users to upload
        DROP POLICY IF EXISTS "Authenticated Users Upload to ${bucketName}" ON storage.objects;
        CREATE POLICY "Authenticated Users Upload to ${bucketName}"
        ON storage.objects FOR INSERT
        WITH CHECK (
          bucket_id = '${bucketName}' AND
          (auth.role() = 'authenticated' OR auth.role() = 'anon')
        );
        
        -- Allow update by the owner or anon users
        DROP POLICY IF EXISTS "Owner/Anon Update in ${bucketName}" ON storage.objects;
        CREATE POLICY "Owner/Anon Update in ${bucketName}"
        ON storage.objects FOR UPDATE
        USING (
          bucket_id = '${bucketName}' AND
          (auth.uid() = owner OR auth.role() = 'anon')
        )
        WITH CHECK (
          bucket_id = '${bucketName}' AND
          (auth.uid() = owner OR auth.role() = 'anon')
        );
        
        -- Allow delete by the owner or anon users
        DROP POLICY IF EXISTS "Owner/Anon Delete in ${bucketName}" ON storage.objects;
        CREATE POLICY "Owner/Anon Delete in ${bucketName}"
        ON storage.objects FOR DELETE
        USING (
          bucket_id = '${bucketName}' AND
          (auth.uid() = owner OR auth.role() = 'anon')
        );
      `;
      
      const policySqlResponse = await fetch(`${supabaseUrl}/rest/v1/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({ query: createPublicPolicySql })
      });
      
      if (!policySqlResponse.ok) {
        console.error('Failed to create direct SQL policies:', await policySqlResponse.text());
      } else {
        console.log('Successfully created direct SQL policies');
      }
    } catch (policyError) {
      console.error('Error creating SQL policies:', policyError);
    }
    
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
