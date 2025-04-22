
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

serve(async (req) => {
  try {
    // Parse the request body
    const { bucketName = 'menu-media' } = await req.json();
    
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ 
          error: "Missing environment variables" 
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      throw listError;
    }
    
    // Look for the bucket
    let bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    // Create bucket if it doesn't exist
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
        // If the bucket already exists (race condition), continue
        if (!createError.message.includes('already exists')) {
          throw createError;
        }
        bucketExists = true;
      }
    }
    
    // Create RLS policies using SQL
    const { error: policyError } = await supabase.rpc('create_storage_policies', { 
      bucket_name: bucketName 
    });
    
    if (policyError) {
      console.error("Error creating policies:", policyError);
      // Try alternative approach with direct SQL queries
      await setupPoliciesDirectly(supabase, bucketName);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Bucket ${bucketName} setup completed successfully` 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-storage-policy function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unknown error occurred" 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

// Helper function to set up policies directly with SQL
async function setupPoliciesDirectly(supabase: any, bucketName: string) {
  try {
    // Create policies directly using SQL
    await supabase.rpc('exec_sql', {
      query: `
        -- Enable RLS on storage.objects
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
        
        -- Allow public read access to the bucket
        DROP POLICY IF EXISTS "Allow public read access to ${bucketName}" ON storage.objects;
        CREATE POLICY "Allow public read access to ${bucketName}"
        ON storage.objects FOR SELECT
        USING (bucket_id = '${bucketName}');
        
        -- Allow authenticated users to upload to the bucket
        DROP POLICY IF EXISTS "Allow authenticated uploads to ${bucketName}" ON storage.objects;
        CREATE POLICY "Allow authenticated uploads to ${bucketName}"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = '${bucketName}');
        
        -- Allow users to update and delete their own objects
        DROP POLICY IF EXISTS "Allow users to update their uploads in ${bucketName}" ON storage.objects;
        CREATE POLICY "Allow users to update their uploads in ${bucketName}"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = '${bucketName}' AND owner = auth.uid())
        WITH CHECK (bucket_id = '${bucketName}');
        
        DROP POLICY IF EXISTS "Allow users to delete their uploads in ${bucketName}" ON storage.objects;
        CREATE POLICY "Allow users to delete their uploads in ${bucketName}"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = '${bucketName}' AND owner = auth.uid());
      `
    });
    
    console.log(`Successfully created policies for ${bucketName} bucket`);
  } catch (error) {
    console.error("Error creating policies directly:", error);
    throw new Error(`Failed to setup storage policies: ${error.message}`);
  }
}
