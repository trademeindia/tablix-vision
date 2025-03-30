
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

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
    // Parse request body
    const { folderName } = await req.json();
    
    if (!folderName) {
      return new Response(
        JSON.stringify({ error: 'Folder name is required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Creating Google Drive folder named: ${folderName}`);
    
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
          error: `Failed to authenticate with Google: ${tokenData.error_description || 'Unknown error'}`,
          details: tokenData 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const accessToken = tokenData.access_token;
    console.log('Successfully obtained Google access token');
    
    // Create a folder in Google Drive
    console.log('Creating folder in Google Drive');
    const createFolderResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });
    
    const folderData = await createFolderResponse.json();
    
    if (!createFolderResponse.ok) {
      console.error('Failed to create folder:', folderData);
      return new Response(
        JSON.stringify({ 
          error: `Failed to create folder in Google Drive: ${folderData.error?.message || 'Unknown error'}`,
          details: folderData
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Folder created with ID: ${folderData.id}`);
    
    // Update restaurant record with folder ID
    if (req.headers.get('x-restaurant-id')) {
      const restaurantId = req.headers.get('x-restaurant-id');
      console.log(`Updating restaurant ${restaurantId} with folder ID ${folderData.id}`);
      
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      
      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        const { error: updateError } = await supabase
          .from('restaurants')
          .update({ google_drive_folder_id: folderData.id })
          .eq('id', restaurantId);
        
        if (updateError) {
          console.error('Error updating restaurant record:', updateError);
        } else {
          console.log('Restaurant record updated successfully');
        }
      }
    }
    
    // Return success response with folder ID
    return new Response(
      JSON.stringify({ 
        success: true, 
        folderId: folderData.id,
        folderName: folderData.name
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error('Error in create-drive-folder function:', error);
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
