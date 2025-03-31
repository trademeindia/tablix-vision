
import { useState, useCallback } from 'react';
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
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit');
        return;
      }
      
      // Validate file type
      if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
        setError('Only GLB and GLTF files are supported');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      setUploadSuccess(false);
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
      
      // Create an XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Track progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      });
      
      // Get Supabase URL from environment
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not found');
      }
      
      // Create promise to handle XHR
      const response = await new Promise<any>((resolve, reject) => {
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
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.onabort = () => reject(new Error('Upload aborted'));
        
        xhr.send(formData);
      });
      
      if (response.success && response.fileId && response.fileUrl) {
        setUploadSuccess(true);
        onUploadComplete(response.fileId, response.fileUrl);
        toast({
          title: "Upload successful",
          description: "3D model uploaded to Google Drive",
        });
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file');
      toast({
        title: "Upload failed",
        description: err.message || 'There was an error uploading your file',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, menuItemId, restaurantId, onUploadComplete]);
  
  const cancelUpload = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
    setUploadSuccess(false);
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
