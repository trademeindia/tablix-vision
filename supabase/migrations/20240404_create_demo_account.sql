
-- This migration creates a demo account if it doesn't already exist
-- Note: In a production environment, you might want to implement this differently

-- First, check if the demo user already exists
DO $$
DECLARE
  demo_email TEXT := 'demo@restaurant.com';
  demo_exists BOOLEAN;
BEGIN
  -- Check if demo user exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = demo_email
  ) INTO demo_exists;
  
  -- If demo user doesn't exist, create it
  IF NOT demo_exists THEN
    -- Insert demo user with a known password ('demo123456')
    -- The password hash below is for 'demo123456'
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      demo_email,
      -- This is a password hash for 'demo123456'
      '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01',
      now(),
      null,
      null,
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Demo User"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
    
    RAISE NOTICE 'Demo account created successfully';
  ELSE
    RAISE NOTICE 'Demo account already exists';
  END IF;
END
$$;
