
import { corsHeaders } from "./cors.ts";

// Enhanced error response helper
export function errorResponse(message: string, status = 400, details?: any) {
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
export function validateFile(file: File): { valid: boolean; error?: string } {
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
