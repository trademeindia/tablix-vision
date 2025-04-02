
-- This migration creates a demo account if it doesn't already exist

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
      raw_user_meta_data,
      confirmed_at
    ) VALUES (
      demo_email,
      crypt(demo_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Demo User"}',
      now()
    )
    RETURNING id INTO user_id;
    
    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      created_at,
      updated_at,
      last_sign_in_at
    ) VALUES (
      user_id,
      user_id,
      format('{"sub": "%s", "email": "%s"}', user_id::text, demo_email)::jsonb,
      'email',
      now(),
      now(),
      now()
    );
    
    RAISE NOTICE 'Demo account created successfully with ID: %', user_id;
  ELSE
    -- If demo user exists, ensure it's confirmed
    UPDATE auth.users
    SET 
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      confirmed_at = COALESCE(confirmed_at, now())
    WHERE email = demo_email;
    
    RAISE NOTICE 'Demo account already exists, ensured confirmation is set';
  END IF;
END
$$;
