
// Google Drive API integration module

// Google Drive API client with improved error handling
export async function uploadToGoogleDrive(fileBuffer: ArrayBuffer, fileName: string, mimeType: string, folderId: string) {
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
