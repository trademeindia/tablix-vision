
import { google } from "https://esm.sh/@googleapis/drive@8.0.0";

export async function uploadToGoogleDrive(
  fileBuffer: ArrayBuffer,
  fileName: string,
  mimeType: string,
  folderId: string
): Promise<string> {
  console.log(`Uploading ${fileName} to Google Drive folder ${folderId}`);
  
  try {
    const credentials = {
      client_id: Deno.env.get("GOOGLE_CLIENT_ID"),
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET"),
      refresh_token: Deno.env.get("GOOGLE_REFRESH_TOKEN"),
    };
    
    if (!credentials.client_id || !credentials.client_secret || !credentials.refresh_token) {
      throw new Error("Missing Google API credentials");
    }
    
    // Create auth client
    const auth = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret
    );
    
    // Set credentials
    auth.setCredentials({
      refresh_token: credentials.refresh_token
    });
    
    // Initialize drive client
    const drive = google.drive({ version: 'v3', auth });
    
    // Create file metadata
    const fileMetadata = {
      name: fileName,
      mimeType: mimeType,
      parents: [folderId]  // The ID of the folder
    };
    
    // Convert ArrayBuffer to Uint8Array for upload
    const content = new Uint8Array(fileBuffer);
    
    // Upload file
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: mimeType,
        body: content
      },
      fields: 'id'
    });
    
    if (!response.data.id) {
      throw new Error("Failed to get file ID from Google Drive response");
    }
    
    console.log(`File uploaded successfully with ID: ${response.data.id}`);
    
    // Update file permissions to make it accessible with the link
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
    
    console.log("File permissions updated to be publicly accessible");
    
    return response.data.id;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw new Error(`Google Drive upload failed: ${error.message}`);
  }
}
