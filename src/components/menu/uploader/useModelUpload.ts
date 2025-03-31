
import { useState, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseModelUploadProps {
  menuItemId?: string;
  restaurantId?: string;
  onUploadComplete: (fileId: string, fileUrl: string) => void;
}

export const useModelUpload = ({ 
  menuItemId, 
  restaurantId,
  onUploadComplete 
}: UseModelUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setError(null);
      setUploadSuccess(false);
      
      if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit');
        return;
      }
      
      if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
        setError('Only GLB and GLTF files are supported');
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
  }, []);
  
  const uploadFile = useCallback(async () => {
    if (!selectedFile || !menuItemId || !restaurantId) {
      setError('Missing required information');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('menuItemId', menuItemId);
      formData.append('restaurantId', restaurantId);
      
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.min(99, (event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not found');
      }
      
      const MAX_RETRIES = 3;
      let retryCount = 0;
      let success = false;
      
      while (!success && retryCount <= MAX_RETRIES) {
        try {
          const response = await new Promise<{
            success?: boolean;
            fileId?: string;
            fileUrl?: string;
            error?: string;
          }>((resolve, reject) => {
            xhr.open('POST', `${supabaseUrl}/functions/v1/upload-model`);
            
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const data = JSON.parse(xhr.responseText);
                  resolve(data);
                } catch (err) {
                  reject(new Error('Invalid response format'));
                }
              } else {
                reject(new Error(`Upload failed with status: ${xhr.status} - ${xhr.responseText || 'No error details'}`));
              }
            };
            
            xhr.onerror = () => reject(new Error('Network error during upload'));
            xhr.onabort = () => reject(new Error('Upload aborted'));
            
            xhr.send(formData);
          });
          
          if (response.success && response.fileId && response.fileUrl) {
            success = true;
            setUploadProgress(100);
            setUploadSuccess(true);
            onUploadComplete(response.fileId, response.fileUrl);
            
            toast({
              title: "Upload successful",
              description: "3D model uploaded to Google Drive",
            });
          } else {
            throw new Error(response.error || 'Upload failed with unknown error');
          }
        } catch (err: any) {
          retryCount++;
          console.error(`Upload attempt ${retryCount} failed:`, err);
          
          if (retryCount > MAX_RETRIES) {
            throw err;
          }
          
          const delay = Math.pow(2, retryCount) * 1000;
          toast({
            title: "Retrying upload",
            description: `Attempt ${retryCount} of ${MAX_RETRIES} failed. Retrying in ${delay/1000}s...`,
            variant: "default",
          });
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
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
    } finally {
      setIsUploading(false);
      xhrRef.current = null;
    }
  }, [selectedFile, menuItemId, restaurantId, onUploadComplete]);
  
  const cancelUpload = useCallback(() => {
    if (xhrRef.current && isUploading) {
      xhrRef.current.abort();
      toast({
        title: "Upload cancelled",
        description: "The file upload was cancelled",
        variant: "default",
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
};
