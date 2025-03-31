
// Google Drive API integration module with optimization improvements

// Google Drive API client with improved error handling, retries, and caching
export async function uploadToGoogleDrive(fileBuffer: ArrayBuffer, fileName: string, mimeType: string, folderId: string) {
  const MAX_RETRIES = 3;
  let retryCount = 0;
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunk size for large files
  
  // Set a unique cache-breaking identifier for the file
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  const fileNameWithId = fileName.includes('?') 
    ? `${fileName}&_ucid=${uniqueId}` 
    : `${fileName}?_ucid=${uniqueId}`;
  
  while (retryCount <= MAX_RETRIES) {
    try {
      console.log(`Starting Google Drive upload for ${fileName} (${(fileBuffer.byteLength / 1024 / 1024).toFixed(2)} MB) to folder ${folderId} (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      
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

      // Choose upload strategy based on file size
      const isLargeFile = fileBuffer.byteLength > CHUNK_SIZE;
      
      if (isLargeFile) {
        console.log(`Large file detected (${(fileBuffer.byteLength / 1024 / 1024).toFixed(2)} MB), using resumable upload`);
        return await uploadLargeFile(fileBuffer, fileNameWithId, mimeType, folderId, accessToken);
      } else {
        console.log(`Small file detected (${(fileBuffer.byteLength / 1024 / 1024).toFixed(2)} MB), using simple upload`);
        return await uploadSmallFile(fileBuffer, fileNameWithId, mimeType, folderId, accessToken);
      }
    } catch (error) {
      retryCount++;
      console.error(`Google Drive upload error (attempt ${retryCount}/${MAX_RETRIES + 1}):`, error);
      
      if (retryCount > MAX_RETRIES) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`Retrying upload in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This should never be reached due to the throw in the catch block when retries are exhausted
  throw new Error('Upload failed after all retry attempts');
}

// Helper function to upload small files (simple upload)
async function uploadSmallFile(fileBuffer: ArrayBuffer, fileName: string, mimeType: string, folderId: string, accessToken: string): Promise<string> {
  // Add cache control headers to prevent caching issues
  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: mimeType,
    properties: {
      uploadTime: new Date().toISOString(),
    }
  };
  
  const requestBody = new Blob([
    new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
    new Blob([fileBuffer], { type: mimeType })
  ]);
  
  const uploadResponse = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/related; boundary=boundary',
      },
      body: requestBody,
    }
  );
  
  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    console.error('Failed to upload file:', errorText);
    throw new Error(`Failed to upload file to Google Drive: ${errorText}`);
  }
  
  const fileData = await uploadResponse.json();
  console.log(`File successfully uploaded to Google Drive with ID: ${fileData.id}`);
  
  // Set file to never expire from browser cache
  await setFileMetadata(fileData.id, accessToken);
  
  return fileData.id;
}

// Helper function to upload large files (resumable upload with chunking)
async function uploadLargeFile(fileBuffer: ArrayBuffer, fileName: string, mimeType: string, folderId: string, accessToken: string): Promise<string> {
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
      properties: {
        uploadTime: new Date().toISOString(),
      }
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
      'Content-Length': fileBuffer.byteLength.toString(),
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
  
  // Set file to never expire from browser cache
  await setFileMetadata(fileData.id, accessToken);
  
  return fileData.id;
}

// Helper function to set file metadata for caching and performance
async function setFileMetadata(fileId: string, accessToken: string): Promise<void> {
  try {
    console.log('Setting file metadata to optimize caching');
    
    // Set file to never expire from browser cache and make it viewable
    const metadataResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,webViewLink`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Add custom properties for caching
        appProperties: {
          cacheControl: 'public, max-age=31536000', // 1 year
        }
      }),
    });
    
    if (!metadataResponse.ok) {
      console.warn('Failed to set file metadata, but upload was successful');
    } else {
      console.log('File metadata set successfully for optimal caching');
    }
    
    // Verify the file exists and is accessible
    console.log('Verifying file exists in Google Drive...');
    const verifyResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,webContentLink`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!verifyResponse.ok) {
      console.warn('File verification failed, but upload seemed successful. Proceeding anyway.');
    } else {
      const verifyData = await verifyResponse.json();
      console.log('File verified successfully in Google Drive:', verifyData.name);
    }
  } catch (error) {
    // Just log the error but don't fail the upload
    console.error('Error setting file metadata:', error);
  }
}
