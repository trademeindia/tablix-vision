
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { errorResponse, validateFile } from "./validators.ts";
import { uploadToGoogleDrive } from "./google-drive.ts";
import { getRestaurantFolderId, updateMenuItem } from "./database.ts";
import { corsHeaders } from "./cors.ts";

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
    console.log(`File type determined as: ${mimeType}, filename: ${fileName}, size: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
    
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
