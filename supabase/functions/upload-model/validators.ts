
import { corsHeaders } from "./cors.ts";

export function errorResponse(message: string, status = 400, extraData = {}) {
  return new Response(
    JSON.stringify({
      error: message,
      ...extraData,
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

export function validateFile(file: any) {
  if (!file || !(file instanceof File)) {
    return { valid: false, error: 'Invalid file' };
  }
  
  // Check file size (50MB limit)
  if (file.size > 50 * 1024 * 1024) {
    return { valid: false, error: 'File exceeds 50MB size limit' };
  }
  
  // Check file type
  const fileName = file.name.toLowerCase();
  const validExtensions = ['.glb', '.gltf']; 
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return { 
      valid: false, 
      error: 'Only GLB and GLTF files are supported' 
    };
  }
  
  return { valid: true };
}
