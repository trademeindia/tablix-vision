
-- Create a helper table to track storage policy creation requests
CREATE TABLE IF NOT EXISTS public.storage_policies_helper (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMPTZ
);

-- Create a trigger function to create storage policies when a new record is inserted
CREATE OR REPLACE FUNCTION public.create_storage_policies_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert the bucket if it doesn't exist
  BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES (NEW.bucket_name, NEW.bucket_name, true)
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating bucket: %', SQLERRM;
  END;
  
  -- Create READ policy (public access)
  BEGIN
    DROP POLICY IF EXISTS "Public Read Access for menu-media" ON storage.objects;
    CREATE POLICY "Public Read Access for menu-media"
    ON storage.objects FOR SELECT
    USING (bucket_id = NEW.bucket_name);
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating SELECT policy: %', SQLERRM;
  END;
  
  -- Create INSERT policy (authenticated users)
  BEGIN
    DROP POLICY IF EXISTS "Auth Users can INSERT to menu-media" ON storage.objects;
    CREATE POLICY "Auth Users can INSERT to menu-media"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = NEW.bucket_name AND 
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
      bucket_id = NEW.bucket_name AND 
      auth.uid() = owner
    )
    WITH CHECK (
      bucket_id = NEW.bucket_name AND 
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
      bucket_id = NEW.bucket_name AND 
      auth.uid() = owner
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating DELETE policy: %', SQLERRM;
  END;
  
  -- Update the status
  UPDATE public.storage_policies_helper 
  SET status = 'completed', processed_at = now()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS create_storage_policies_trigger ON public.storage_policies_helper;
CREATE TRIGGER create_storage_policies_trigger
AFTER INSERT ON public.storage_policies_helper
FOR EACH ROW
EXECUTE FUNCTION public.create_storage_policies_trigger();
