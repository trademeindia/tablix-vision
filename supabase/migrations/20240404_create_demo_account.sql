
-- This migration creates a demo account if it doesn't already exist
-- Note: In a production environment, you might want to implement this differently

-- First, check if the demo user already exists
DO $$
DECLARE
  demo_email TEXT := 'demo@restaurant.com';
  demo_password TEXT := 'demo123456';
  demo_exists BOOLEAN;
  user_id UUID;
BEGIN
  -- Check if demo user exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = demo_email
  ) INTO demo_exists;
  
  -- If demo user doesn't exist, create it
  IF NOT demo_exists THEN
    -- Insert demo user with a known password ('demo123456')
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data
    ) VALUES (
      demo_email,
      crypt(demo_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Demo User"}'
    )
    RETURNING id INTO user_id;
    
    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      user_id,
      format('{"sub": "%s", "email": "%s"}', user_id::text, demo_email)::jsonb,
      'email',
      now(),
      now()
    );
    
    RAISE NOTICE 'Demo account created successfully with ID: %', user_id;
  ELSE
    RAISE NOTICE 'Demo account already exists';
  END IF;
END
$$;
