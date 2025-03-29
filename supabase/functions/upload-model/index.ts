
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google Drive API client
async function uploadToGoogleDrive(fileBuffer: ArrayBuffer, fileName: string, mimeType: string, folderId: string) {
  try {
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const GOOGLE_REFRESH_TOKEN = Deno.env.get("GOOGLE_REFRESH_TOKEN");

    // Get access token from refresh token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Failed to get access token:', tokenData);
      throw new Error('Failed to authenticate with Google');
    }
    
    const accessToken = tokenData.access_token;

    // Initialize file upload
    const initResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fileName,
        parents: [folderId],
        mimeType: mimeType,
      }),
    });

    if (!initResponse.ok) {
      console.error('Failed to initialize upload:', await initResponse.text());
      throw new Error('Failed to initialize Google Drive upload');
    }

    const uploadUrl = initResponse.headers.get('Location');

    // Upload the file
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
      },
      body: fileBuffer,
    });

    if (!uploadResponse.ok) {
      console.error('Failed to upload file:', await uploadResponse.text());
      throw new Error('Failed to upload file to Google Drive');
    }

    const fileData = await uploadResponse.json();
    return fileData.id;
  } catch (error) {
    console.error('Google Drive upload error:', error);
    throw error;
  }
}

async function getRestaurantFolderId(supabase, restaurantId) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('google_drive_folder_id')
    .eq('id', restaurantId)
    .single();

  if (error || !data) {
    console.error('Error fetching restaurant folder ID:', error);
    throw new Error('Failed to get Google Drive folder ID');
  }

  if (!data.google_drive_folder_id) {
    throw new Error('Restaurant does not have a Google Drive folder configured');
  }

  return data.google_drive_folder_id;
}

async function updateMenuItem(supabase, menuItemId, fileId) {
  const { error } = await supabase
    .from('menu_items')
    .update({
      media_type: '3d',
      media_reference: fileId
    })
    .eq('id', menuItemId);

  if (error) {
    console.error('Error updating menu item:', error);
    throw new Error('Failed to update menu item with file ID');
  }

  return { success: true };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request data
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get file and metadata from the request
    const formData = await req.formData();
    const file = formData.get('file');
    const menuItemId = formData.get('menuItemId');
    const restaurantId = formData.get('restaurantId');
    
    if (!file || !menuItemId || !restaurantId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate file
    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'Invalid file' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: 'File too large. Maximum size is 10MB.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check file type
    const validTypes = ['model/gltf-binary', 'model/gltf+json'];
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.glb') && !fileName.endsWith('.gltf')) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Only GLB and GLTF formats are supported.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the restaurant's Google Drive folder ID
    const folderId = await getRestaurantFolderId(supabase, restaurantId);

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Upload to Google Drive
    const mimeType = fileName.endsWith('.glb') ? 'model/gltf-binary' : 'model/gltf+json';
    const fileId = await uploadToGoogleDrive(arrayBuffer, file.name, mimeType, folderId);

    // Update menu item with file reference
    await updateMenuItem(supabase, menuItemId, fileId);

    // Generate a Google Drive view URL
    const fileViewUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    return new Response(JSON.stringify({ 
      success: true, 
      fileId, 
      fileUrl: fileViewUrl 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
