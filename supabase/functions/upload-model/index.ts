
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced error response helper
function errorResponse(message: string, status = 400, details?: any) {
  console.error(`Error: ${message}`, details || '');
  return new Response(
    JSON.stringify({ 
      error: message,
      details: details || undefined,
      timestamp: new Date().toISOString()
    }), 
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

// Validate file helper
function validateFile(file: File): { valid: boolean; error?: string } {
  if (!(file instanceof File)) {
    return { valid: false, error: 'Invalid file format' };
  }

  // Check file size (10MB limit)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 10MB.' };
  }

  // Check file type
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.glb') && !fileName.endsWith('.gltf')) {
    return { valid: false, error: 'Invalid file type. Only GLB and GLTF formats are supported.' };
  }

  return { valid: true };
}

// Google Drive API client with improved error handling
async function uploadToGoogleDrive(fileBuffer: ArrayBuffer, fileName: string, mimeType: string, folderId: string) {
  try {
    console.log(`Starting Google Drive upload for ${fileName} to folder ${folderId}`);
    
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const GOOGLE_REFRESH_TOKEN = Deno.env.get("GOOGLE_REFRESH_TOKEN");

    // Validate credentials
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      throw new Error('Missing Google Drive API credentials');
    }

    // Get access token from refresh token
    console.log('Requesting Google OAuth access token');
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
      throw new Error(`Failed to authenticate with Google: ${tokenData.error_description || 'Unknown error'}`);
    }
    
    const accessToken = tokenData.access_token;
    console.log('Successfully obtained Google access token');

    // Initialize file upload
    console.log('Initializing resumable upload to Google Drive');
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
      const errorText = await initResponse.text();
      console.error('Failed to initialize upload:', errorText);
      throw new Error(`Failed to initialize Google Drive upload: ${errorText}`);
    }

    const uploadUrl = initResponse.headers.get('Location');
    if (!uploadUrl) {
      throw new Error('No upload URL returned from Google Drive');
    }

    // Upload the file
    console.log(`Uploading file to Google Drive (${(fileBuffer.byteLength / 1024 / 1024).toFixed(2)} MB)`);
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
      },
      body: fileBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Failed to upload file:', errorText);
      throw new Error(`Failed to upload file to Google Drive: ${errorText}`);
    }

    const fileData = await uploadResponse.json();
    console.log(`File successfully uploaded to Google Drive with ID: ${fileData.id}`);
    return fileData.id;
  } catch (error) {
    console.error('Google Drive upload error:', error);
    throw error;
  }
}

async function getRestaurantFolderId(supabase, restaurantId) {
  console.log(`Fetching folder ID for restaurant: ${restaurantId}`);
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('google_drive_folder_id')
      .eq('id', restaurantId)
      .single();

    if (error) {
      console.error('Error fetching restaurant folder ID:', error);
      throw new Error(`Failed to get Google Drive folder ID: ${error.message}`);
    }

    if (!data || !data.google_drive_folder_id) {
      throw new Error('Restaurant does not have a Google Drive folder configured');
    }

    console.log(`Found folder ID: ${data.google_drive_folder_id}`);
    return data.google_drive_folder_id;
  } catch (error) {
    console.error('Error in getRestaurantFolderId:', error.message);
    throw error;
  }
}

async function updateMenuItem(supabase, menuItemId, fileId, fileUrl) {
  console.log(`Updating menu item ${menuItemId} with file ID ${fileId}`);
  try {
    // Skip updating for new items (they'll be created with this info)
    if (menuItemId === 'new-item') {
      console.log('Skipping database update for new item');
      return { success: true };
    }
    
    const { error } = await supabase
      .from('menu_items')
      .update({
        media_type: '3d',
        media_reference: fileId,
        model_url: fileUrl
      })
      .eq('id', menuItemId);

    if (error) {
      console.error('Error updating menu item:', error);
      throw new Error(`Failed to update menu item with file ID: ${error.message}`);
    }

    console.log('Menu item successfully updated');
    return { success: true };
  } catch (error) {
    console.error('Error in updateMenuItem:', error.message);
    throw error;
  }
}

serve(async (req) => {
  console.log(`Received ${req.method} request for upload-model`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return errorResponse('Method not allowed', 405);
    }

    console.log('Processing file upload request');
    
    // Get file and metadata from the request
    const formData = await req.formData().catch(err => {
      console.error('Error parsing form data:', err);
      throw new Error('Failed to parse form data');
    });
    
    const file = formData.get('file');
    const menuItemId = formData.get('menuItemId');
    const restaurantId = formData.get('restaurantId');
    
    console.log(`Received upload request for menu item: ${menuItemId}, restaurant: ${restaurantId}`);
    
    // Validate required fields
    if (!file || !menuItemId || !restaurantId) {
      const missingFields = [];
      if (!file) missingFields.push('file');
      if (!menuItemId) missingFields.push('menuItemId');
      if (!restaurantId) missingFields.push('restaurantId');
      
      return errorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    // Validate file
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return errorResponse(fileValidation.error || 'Invalid file', 400);
    }

    // Initialize Supabase client
    console.log('Initializing Supabase client');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      return errorResponse('Missing Supabase credentials', 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the restaurant's Google Drive folder ID
    const folderId = await getRestaurantFolderId(supabase, restaurantId);

    // Convert file to ArrayBuffer
    console.log('Processing file for upload');
    const arrayBuffer = await file.arrayBuffer();

    // Upload to Google Drive
    const fileName = file.name;
    const mimeType = fileName.endsWith('.glb') ? 'model/gltf-binary' : 'model/gltf+json';
    console.log(`File type determined as: ${mimeType}`);
    
    const fileId = await uploadToGoogleDrive(arrayBuffer, fileName, mimeType, folderId);

    // Generate a Google Drive view URL
    const fileViewUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    console.log(`File view URL: ${fileViewUrl}`);

    // Update menu item with file reference if not a new item
    await updateMenuItem(supabase, menuItemId, fileId, fileViewUrl);

    console.log('Upload process completed successfully');
    return new Response(JSON.stringify({ 
      success: true, 
      fileId, 
      fileUrl: fileViewUrl 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing upload request:', error);
    return errorResponse(
      `Upload failed: ${error.message || 'Unknown error'}`, 
      500, 
      { stack: error.stack }
    );
  }
});
