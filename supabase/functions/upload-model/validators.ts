
import { corsHeaders } from "./cors.ts";

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  const fileSize = file.size;
  const fileName = file.name.toLowerCase();
  
  // Check file size (50MB limit)
  if (fileSize > 50 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }
  
  // Check file type
  if (!fileName.endsWith('.glb') && !fileName.endsWith('.gltf')) {
    return { 
      valid: false, 
      error: 'Invalid file type. Only GLB and GLTF formats are supported' 
    };
  }
  
  return { valid: true };
}

export function errorResponse(message: string, status: number, details?: any) {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      details: details || null,
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
