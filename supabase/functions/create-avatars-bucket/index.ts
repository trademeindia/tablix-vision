
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

serve(async (req) => {
  try {
    // Create a Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Create a storage bucket for avatars
    const { data, error } = await supabaseAdmin.storage.createBucket('avatars', {
      public: false,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      fileSizeLimit: 1024 * 1024 * 2, // 2MB
    });

    if (error) {
      throw error;
    }

    // Create a policy to allow users to upload their own avatars
    await supabaseAdmin.storage
      .from('avatars')
      .createBucketApiKey('profiles');

    // Create policy to allow authenticated users to upload avatars
    await supabaseAdmin.storage.from('avatars').createPolicy('Authenticated users can upload avatars', {
      name: 'authenticated_can_upload',
      definition: {
        type: 'INSERT',
        condition: 'true',
        role: 'authenticated',
      },
    });

    // Create policy to allow users to read their own avatars
    await supabaseAdmin.storage.from('avatars').createPolicy('Users can view their own avatars', {
      name: 'users_can_view_own_avatars',
      definition: {
        type: 'SELECT',
        condition: 'true',
        role: 'authenticated',
      },
    });

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
