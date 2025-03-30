
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file');
    const folderId = formData.get('folderId');
    
    if (!file || !folderId) {
      return new Response(
        JSON.stringify({ error: 'File and folder ID are required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file format' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Uploading test file to folder: ${folderId}`);
    
    // Get Google Drive credentials from environment
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const GOOGLE_REFRESH_TOKEN = Deno.env.get("GOOGLE_REFRESH_TOKEN");
    
    // Check that all required env variables are set
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      console.error('Missing Google Drive API credentials');
      return new Response(
        JSON.stringify({ error: 'Missing Google Drive API credentials' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
      return new Response(
        JSON.stringify({ 
          error: `Failed to authenticate with Google: ${tokenData.error_description || 'Unknown error'}` 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
        name: file.name,
        parents: [folderId],
        mimeType: file.type || 'text/plain',
      }),
    });
    
    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error('Failed to initialize upload:', errorText);
      return new Response(
        JSON.stringify({ error: `Failed to initialize Google Drive upload: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const uploadUrl = initResponse.headers.get('Location');
    if (!uploadUrl) {
      return new Response(
        JSON.stringify({ error: 'No upload URL returned from Google Drive' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Upload the file
    const fileBuffer = await file.arrayBuffer();
    console.log(`Uploading file to Google Drive (${(fileBuffer.byteLength / 1024).toFixed(2)} KB)`);
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'text/plain',
      },
      body: fileBuffer,
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Failed to upload file:', errorText);
      return new Response(
        JSON.stringify({ error: `Failed to upload file to Google Drive: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const fileData = await uploadResponse.json();
    console.log(`File successfully uploaded to Google Drive with ID: ${fileData.id}`);
    
    // Return success response with file ID
    return new Response(
      JSON.stringify({ 
        success: true, 
        fileId: fileData.id,
        fileName: fileData.name
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error('Error in test-drive-upload function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal Server Error',
        stack: error.stack || null,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
