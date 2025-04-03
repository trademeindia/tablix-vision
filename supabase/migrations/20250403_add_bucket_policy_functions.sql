
-- Function to create read policy for a bucket
CREATE OR REPLACE FUNCTION public.create_read_policy_for_bucket(bucket_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Public Read Access ' || bucket_name
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, operation, definition)
    VALUES (
      'Public Read Access ' || bucket_name,
      bucket_name,
      'SELECT',
      '(bucket_id = ''' || bucket_name || '''::text)'
    );
  END IF;
END;
$$;

-- Function to create insert policy for a bucket
CREATE OR REPLACE FUNCTION public.create_insert_policy_for_bucket(bucket_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Auth Insert Access ' || bucket_name
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, operation, definition)
    VALUES (
      'Auth Insert Access ' || bucket_name,
      bucket_name,
      'INSERT',
      '(bucket_id = ''' || bucket_name || '''::text AND auth.role() = ''authenticated'')'
    );
  END IF;
END;
$$;

-- Create a combined function that can be called from client code
CREATE OR REPLACE FUNCTION public.create_storage_policy(bucket_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM public.create_read_policy_for_bucket(bucket_name);
  PERFORM public.create_insert_policy_for_bucket(bucket_name);
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;
