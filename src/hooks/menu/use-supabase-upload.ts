
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

// Helper function to map extensions to MIME types
const getMimeType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'glb':
      return 'model/gltf-binary';
    case 'gltf':
      return 'model/gltf+json';
    default:
      return 'application/octet-stream'; // Default MIME type for binary files
  }
};

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
  
  const generateFilePath = (file: File): string => {
    const fileExt = file.name.split('.').pop();
    const uniqueId = uuidv4();
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
      
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }
      
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
      
      const filePath = generateFilePath(selectedFile);
      const contentType = getMimeType(selectedFile.name);
      
      // Create progress simulation
      const simulateProgress = () => {
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              return prev;
            }
            return prev + 5;
          });
        }, 300);
        
        return interval;
      };
      
      const progressInterval = simulateProgress();
      
      console.log(`Uploading ${selectedFile.name} as ${contentType} to ${bucketName}/${filePath}`);
      
      // Try multiple upload approaches in sequence if needed
      let uploadResult;
      let uploadError;
      
      // Approach 1: Try with content type explicitly set
      try {
        uploadResult = await supabase.storage
          .from(bucketName)
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: true, 
            contentType
          });
        
        uploadError = uploadResult.error;
      } catch (err) {
        console.error('First upload attempt failed:', err);
        uploadError = err;
      }
      
      // Approach 2: If first attempt failed, try without contentType
      if (uploadError) {
        console.log('Trying alternative upload without explicit content type...');
        
        try {
          uploadResult = await supabase.storage
            .from(bucketName)
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: true
            });
          
          uploadError = uploadResult.error;
        } catch (err) {
          console.error('Second upload attempt failed:', err);
          uploadError = err;
        }
      }
      
      // Approach 3: If both attempts failed, try with explicit octet-stream
      if (uploadError) {
        console.log('Trying final upload attempt with generic content type...');
        
        try {
          uploadResult = await supabase.storage
            .from(bucketName)
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: true,
              contentType: 'application/octet-stream'
            });
          
          uploadError = uploadResult.error;
        } catch (err) {
          console.error('Final upload attempt failed:', err);
          uploadError = err;
        }
      }
      
      clearInterval(progressInterval);
      
      // If all attempts failed, throw error
      if (uploadError) {
        throw new Error(uploadError.message || 'All upload attempts failed');
      }
      
      // Get the public URL for the uploaded file
      const publicUrlData = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      const publicUrl = publicUrlData.data.publicUrl;
      
      setUploadProgress(100);
      setUploadSuccess(true);
      
      toast({
        title: "Upload successful",
        description: "File uploaded successfully",
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
        description: err.message || 'Failed to upload file. Please try again.',
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, bucketName, generateFilePath, restaurantId, itemId, folderPath]);
  
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
