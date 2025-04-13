
-- Create a function to easily create storage policies through edge functions
CREATE OR REPLACE FUNCTION create_storage_policy(
  bucket_name TEXT,
  policy_name TEXT,
  definition TEXT,
  action TEXT
) RETURNS VOID AS $$
DECLARE
  policy_exists BOOLEAN;
BEGIN
  -- Check if policy already exists
  SELECT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = policy_name
  ) INTO policy_exists;

  -- If policy doesn't exist, create it
  IF NOT policy_exists THEN
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR %s TO authenticated USING (bucket_id = %L AND %s)',
      policy_name,
      action,
      bucket_name,
      definition
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
