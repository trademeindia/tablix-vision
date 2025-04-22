
-- This file is for reference only, it will be executed by the edge function

-- Create a stored procedure to create storage policies
CREATE OR REPLACE FUNCTION create_storage_policies(bucket_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  -- Enable RLS on storage.objects
  EXECUTE 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;';
  
  -- Allow public read access to the bucket
  EXECUTE format('
    DROP POLICY IF EXISTS "Allow public read access to %I" ON storage.objects;
    CREATE POLICY "Allow public read access to %I"
    ON storage.objects FOR SELECT
    USING (bucket_id = %L);
  ', bucket_name, bucket_name, bucket_name);
  
  -- Allow authenticated users to upload to the bucket
  EXECUTE format('
    DROP POLICY IF EXISTS "Allow authenticated uploads to %I" ON storage.objects;
    CREATE POLICY "Allow authenticated uploads to %I"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name, bucket_name);
  
  -- Allow users to update and delete their own objects
  EXECUTE format('
    DROP POLICY IF EXISTS "Allow users to update their uploads in %I" ON storage.objects;
    CREATE POLICY "Allow users to update their uploads in %I"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = %L AND owner = auth.uid())
    WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name, bucket_name, bucket_name);
  
  EXECUTE format('
    DROP POLICY IF EXISTS "Allow users to delete their uploads in %I" ON storage.objects;
    CREATE POLICY "Allow users to delete their uploads in %I"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = %L AND owner = auth.uid());
  ', bucket_name, bucket_name, bucket_name);
END;
$$;

-- Create a function to execute SQL directly (for fallback)
CREATE OR REPLACE FUNCTION exec_sql(query TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE query;
END;
$$;
