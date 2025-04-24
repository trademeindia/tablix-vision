
-- Create a secure function to execute SQL statements
-- This will be used by the edge function to create storage policies
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE query;
END;
$$;

-- Grant execute permission on the function to the service_role
GRANT EXECUTE ON FUNCTION exec_sql TO service_role;
