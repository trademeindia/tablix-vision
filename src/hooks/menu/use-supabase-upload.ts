
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { createStorageBucket } from './use-create-storage-bucket';

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
      
      // First, ensure bucket exists using our helper function
      await createStorageBucket(bucketName);
      
      // Try upload with content type first
      let uploadResult = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true, 
          contentType
        });
      
      clearInterval(progressInterval);
      
      // Handle errors from the upload
      if (uploadResult.error) {
        console.error('Upload error:', uploadResult.error);
        
        // Try an alternative approach without contentType if that was the issue
        if (uploadResult.error.message?.includes('mime type') || 
            uploadResult.error.message?.includes('not supported')) {
          console.log('Trying alternative upload without explicit content type...');
          
          const altUploadResult = await supabase.storage
            .from(bucketName)
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (altUploadResult.error) {
            throw new Error(`Alternative upload failed: ${altUploadResult.error.message}`);
          }
          
          // If we got here, the alternative upload worked
          console.log('Alternative upload succeeded');
          uploadResult = altUploadResult;
        } else {
          throw new Error(uploadResult.error.message);
        }
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
