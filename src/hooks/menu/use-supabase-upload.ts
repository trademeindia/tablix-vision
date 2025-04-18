
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface UseSupabaseUploadProps {
  restaurantId?: string;
  itemId?: string;
  bucketName: string;
  allowedFileTypes?: string[];
}

interface UploadResult {
  path: string;
  url: string;
}

export function useSupabaseUpload({
  restaurantId,
  itemId,
  bucketName,
  allowedFileTypes = ['.glb', '.gltf', '.jpg', '.jpeg', '.png', '.gif']
}: UseSupabaseUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setError(null);
      setUploadSuccess(false);
      
      if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit');
        return;
      }
      
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const isAllowedType = allowedFileTypes.some(type => 
        type.endsWith(fileExt) || type === '.' + fileExt
      );
      
      if (!isAllowedType) {
        setError(`Only ${allowedFileTypes.join(', ')} files are supported`);
        return;
      }
      
      setSelectedFile(file);
      
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "Large file detected",
          description: `This ${(file.size / (1024 * 1024)).toFixed(1)}MB file may take longer to upload. Please be patient.`,
        });
      }
    }
  }, [allowedFileTypes]);
  
  const uploadFile = useCallback(async (): Promise<UploadResult | null> => {
    if (!selectedFile || !bucketName) {
      setError('Missing required information');
      return null;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.warn(`Bucket "${bucketName}" does not exist. Creating now...`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true
        });
        
        if (createError) {
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }
      }
      
      // Generate a unique file name with appropriate extension
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const uniqueId = uuidv4().substring(0, 8);
      const safeFileName = selectedFile.name
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .toLowerCase();
      
      // Create a folder structure: restaurantId/items/itemId-uniqueId.ext
      const filePath = restaurantId 
        ? `${restaurantId}${itemId ? `/items/${itemId}` : ''}/file_${uniqueId}_${safeFileName}`
        : `uploads/${uniqueId}_${safeFileName}`;
      
      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }
      
      setUploadProgress(100);
      setUploadSuccess(true);
      
      toast({
        title: "Upload successful",
        description: "File uploaded successfully",
      });
      
      return {
        path: filePath,
        url: publicUrlData.publicUrl
      };
      
    } catch (err: any) {
      console.error('Upload error:', err);
      
      let errorMessage = err.message || 'Failed to upload file';
      
      if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        errorMessage = 'Network connection issue. Please check your internet connection and try again.';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'The upload timed out. The file may be too large or your connection is slow.';
      } else if (errorMessage.includes('permission') || errorMessage.includes('auth')) {
        errorMessage = 'Permission denied. You may not have access to upload files.';
      } else if (errorMessage.includes('format')) {
        errorMessage = 'The file format is not supported or the file is corrupted.';
      }
      
      setError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  }, [selectedFile, bucketName, restaurantId, itemId]);
  
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current && isUploading) {
      abortControllerRef.current.abort();
      toast({
        title: "Upload cancelled",
        description: "The file upload was cancelled",
      });
    }
    
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    setIsUploading(false);
  }, [isUploading]);
  
  return {
    isUploading,
    uploadProgress,
    error,
    selectedFile,
    uploadSuccess,
    handleFileChange,
    uploadFile,
    cancelUpload
  };
}
