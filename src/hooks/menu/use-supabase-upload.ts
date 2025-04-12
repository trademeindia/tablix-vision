
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseSupabaseUploadProps {
  restaurantId?: string;
  itemId?: string;
  bucketName?: string;
  folderPath?: string;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
}

interface UploadResult {
  path: string;
  url: string;
}

export const useSupabaseUpload = ({
  restaurantId = '',
  itemId = '',
  bucketName = 'menu-media',
  folderPath = '',
  maxSizeMB = 50,
  allowedFileTypes = ['.jpg', '.jpeg', '.png', '.gif', '.glb', '.gltf']
}: UseSupabaseUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Generate a unique file path for the upload
  const generateFilePath = (file: File): string => {
    const fileExt = file.name.split('.').pop();
    const uniqueId = uuidv4();
    // Build path structure: restaurant/item/uniqueid.ext
    let path = '';
    
    if (folderPath) {
      path += `${folderPath}/`;
    }
    
    if (restaurantId) {
      path += `${restaurantId}/`;
    }
    
    if (itemId) {
      path += `${itemId}/`;
    }
    
    return `${path}${uniqueId}.${fileExt}`;
  };
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setError(null);
      setUploadSuccess(false);
      
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }
      
      // Check file type
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!allowedFileTypes.includes(fileExt)) {
        setError(`Only ${allowedFileTypes.join(', ')} files are supported`);
        return;
      }
      
      setSelectedFile(file);
      
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "Large file detected",
          description: `This ${(file.size / (1024 * 1024)).toFixed(1)}MB file may take longer to upload. Please be patient.`,
          variant: "default",
        });
      }
    }
  }, [allowedFileTypes, maxSizeMB]);
  
  const uploadFile = useCallback(async (): Promise<UploadResult | null> => {
    if (!selectedFile) {
      setError('No file selected');
      return null;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Create a unique file path
      const filePath = generateFilePath(selectedFile);
      
      // Create an abort controller for upload
      const abortController = new AbortController();
      
      // Set up progress tracking
      let uploadProgress = 0;
      const progressHandler = (progress: { loaded: number; total: number }) => {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress(percentage);
        uploadProgress = percentage;
      };
      
      // Upload to Supabase Storage with manually tracking progress
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          // Using signal from AbortController instead of onUploadProgress
          signal: abortController.signal
        });
      
      // Manually set final progress
      setUploadProgress(100);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      setUploadSuccess(true);
      setUploadProgress(100);
      
      toast({
        title: "Upload successful",
        description: "File uploaded to Supabase Storage",
      });
      
      return {
        path: filePath,
        url: publicUrl
      };
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file');
      toast({
        title: "Upload failed",
        description: err.message || 'Failed to upload file',
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, bucketName]);
  
  const cancelUpload = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    setIsUploading(false);
  }, []);
  
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
};
