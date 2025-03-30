
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface UseModelUploadProps {
  menuItemId?: string;
  restaurantId?: string;
  onUploadComplete: (fileId: string, fileUrl: string) => void;
}

export const useModelUpload = ({ menuItemId, restaurantId, onUploadComplete }: UseModelUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadSuccess(false);
    
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    
    const file = e.target.files[0];
    
    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.glb') && !fileName.endsWith('.gltf')) {
      setError('Invalid file type. Only GLB and GLTF formats are supported.');
      setSelectedFile(null);
      return;
    }
    
    // Validate file size (10MB max)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 10MB.');
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile || !menuItemId || !restaurantId) {
      setError('Missing required data for upload');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('menuItemId', menuItemId);
      formData.append('restaurantId', restaurantId);
      
      setUploadProgress(30);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('upload-model', {
        body: formData,
      });
      
      setUploadProgress(90);
      
      if (error) {
        throw new Error(error.message || 'Upload failed');
      }
      
      if (!data || !data.success) {
        throw new Error((data && data.error) || 'Unknown error occurred');
      }
      
      setUploadProgress(100);
      setUploadSuccess(true);
      
      // Call the callback with the file ID and URL
      onUploadComplete(data.fileId, data.fileUrl);
      
      toast({
        title: "Upload complete",
        description: "3D model has been uploaded successfully to Google Drive",
      });
      
      // Reset selected file but keep success state
      setSelectedFile(null);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file');
      toast({
        title: "Upload failed",
        description: err.message || 'An error occurred during upload',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setError(null);
    setUploadSuccess(false);
  };

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
