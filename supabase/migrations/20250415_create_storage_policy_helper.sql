
-- Function to create storage policies for a bucket
CREATE OR REPLACE FUNCTION public.create_storage_policies(bucket_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Try to insert the bucket if it doesn't exist
  BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES (bucket_name, bucket_name, true)
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating bucket: %', SQLERRM;
  END;
  
  -- Create READ policy (public access)
  BEGIN
    DROP POLICY IF EXISTS "Public Read Access for menu-media" ON storage.objects;
    CREATE POLICY "Public Read Access for menu-media"
    ON storage.objects FOR SELECT
    USING (bucket_id = bucket_name);
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating SELECT policy: %', SQLERRM;
  END;
  
  -- Create INSERT policy (authenticated users)
  BEGIN
    DROP POLICY IF EXISTS "Auth Users can INSERT to menu-media" ON storage.objects;
    CREATE POLICY "Auth Users can INSERT to menu-media"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = bucket_name AND 
      auth.role() = 'authenticated'
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating INSERT policy: %', SQLERRM;
  END;
  
  -- Create UPDATE policy (owner only)
  BEGIN
    DROP POLICY IF EXISTS "Auth Users can UPDATE own objects in menu-media" ON storage.objects;
    CREATE POLICY "Auth Users can UPDATE own objects in menu-media"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = bucket_name AND 
      auth.uid() = owner
    )
    WITH CHECK (
      bucket_id = bucket_name AND 
      auth.uid() = owner
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating UPDATE policy: %', SQLERRM;
  END;
  
  -- Create DELETE policy (owner only)
  BEGIN
    DROP POLICY IF EXISTS "Auth Users can DELETE own objects in menu-media" ON storage.objects;
    CREATE POLICY "Auth Users can DELETE own objects in menu-media"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = bucket_name AND 
      auth.uid() = owner
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating DELETE policy: %', SQLERRM;
  END;
  
  RETURN TRUE;
END;
$$;
