
-- Update existing function to properly handle more MIME types 
-- and create a more permissive storage policy
CREATE OR REPLACE FUNCTION public.create_storage_policies(bucket_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Try to create the bucket if it doesn't exist with public access
  BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      bucket_name, 
      bucket_name, 
      true,
      52428800, -- 50MB
      ARRAY[
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'model/gltf-binary', 
        'model/gltf+json',
        'application/octet-stream', -- Important for some 3D files
        'application/gltf-binary'   -- Alternative MIME type
      ]
    )
    ON CONFLICT (id) DO UPDATE SET 
      public = true,
      file_size_limit = 52428800,
      allowed_mime_types = ARRAY[
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'model/gltf-binary', 
        'model/gltf+json',
        'application/octet-stream',
        'application/gltf-binary'
      ];
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating/updating bucket: %', SQLERRM;
  END;
  
  -- Create READ policy (public access)
  BEGIN
    DROP POLICY IF EXISTS "Public Read Access for bucket" ON storage.objects;
    CREATE POLICY "Public Read Access for bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = bucket_name);
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating SELECT policy: %', SQLERRM;
  END;
  
  -- Create INSERT policy (authenticated users and anon)
  BEGIN
    DROP POLICY IF EXISTS "Auth Users can INSERT to bucket" ON storage.objects;
    CREATE POLICY "Auth Users can INSERT to bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = bucket_name AND 
      (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating INSERT policy: %', SQLERRM;
  END;
  
  -- Create UPDATE policy (owner or anon)
  BEGIN
    DROP POLICY IF EXISTS "Auth Users can UPDATE own objects in bucket" ON storage.objects;
    CREATE POLICY "Auth Users can UPDATE own objects in bucket"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = bucket_name AND 
      (auth.uid() = owner OR auth.role() = 'anon')
    )
    WITH CHECK (
      bucket_id = bucket_name AND 
      (auth.uid() = owner OR auth.role() = 'anon')
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating UPDATE policy: %', SQLERRM;
  END;
  
  -- Create DELETE policy (owner or anon)
  BEGIN
    DROP POLICY IF EXISTS "Auth Users can DELETE own objects in bucket" ON storage.objects;
    CREATE POLICY "Auth Users can DELETE own objects in bucket"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = bucket_name AND 
      (auth.uid() = owner OR auth.role() = 'anon')
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating DELETE policy: %', SQLERRM;
  END;
  
  RETURN TRUE;
END;
$$;
