
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
      confirmed_at,
      confirmation_sent_at
    ) VALUES (
      demo_email,
      crypt(demo_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Demo User"}',
      now(),
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
    
    -- CRITICAL: Ensure the email is considered confirmed
    UPDATE auth.users 
    SET email_confirmed_at = now(),
        confirmed_at = now(),
        is_confirmed = true
    WHERE id = user_id;
    
    RAISE NOTICE 'Demo account created successfully with ID: %', user_id;
  ELSE
    -- If demo user exists, ensure it has all required fields set
    UPDATE auth.users
    SET 
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      confirmed_at = COALESCE(confirmed_at, now()),
      confirmation_sent_at = COALESCE(confirmation_sent_at, now()),
      is_confirmed = true,
      raw_user_meta_data = COALESCE(raw_user_meta_data, '{"full_name": "Demo User"}'::jsonb)
    WHERE email = demo_email;
    
    -- Make sure encrypted_password is set properly
    UPDATE auth.users
    SET encrypted_password = crypt(demo_password, gen_salt('bf'))
    WHERE email = demo_email 
    AND (encrypted_password IS NULL OR encrypted_password = '');
    
    SELECT id INTO user_id FROM auth.users WHERE email = demo_email;
    
    -- Make sure the identity exists
    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = user_id) THEN
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
    END IF;
    
    RAISE NOTICE 'Demo account already exists, updated configuration for ID: %', user_id;
  END IF;
END
$$;
