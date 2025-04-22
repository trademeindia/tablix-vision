
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'

// Set up CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    
    const { bucketName } = await req.json()
    
    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Bucket name is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Call the stored procedure to create storage policies
    const { data, error } = await supabaseClient.rpc('create_storage_policies', { bucket_name: bucketName })
    
    if (error) {
      console.error('Error creating storage policies:', error)
      
      // Try alternative direct SQL approach if RPC fails
      try {
        const { data: sqlData, error: sqlError } = await supabaseClient.rpc('exec_sql', {
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
        })
        
        if (sqlError) {
          throw sqlError
        }
        
        return new Response(
          JSON.stringify({ message: 'Storage policies created successfully via SQL', data: sqlData }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      } catch (sqlExecError) {
        console.error('Error executing SQL:', sqlExecError)
        throw error
      }
    }
    
    return new Response(
      JSON.stringify({ message: 'Storage policies created successfully', data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (err) {
    console.error('Error in create-storage-policy function:', err)
    
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
