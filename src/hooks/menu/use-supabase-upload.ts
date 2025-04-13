
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
const getMimeType = (fileName: string): string | undefined => {
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
      return undefined; // Let Supabase infer if unknown
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
      
      console.log(`Uploading ${selectedFile.name} as ${contentType || 'inferred type'} to ${bucketName}/${filePath}`);
      
      // First, ensure bucket exists by calling our utility function
      try {
        await ensureBucketExists(bucketName);
      } catch (bucketError) {
        console.warn('Error ensuring bucket exists, attempting upload anyway:', bucketError);
      }

      // Upload file to Supabase Storage WITH explicit contentType
      let uploadResponse = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true, // Changed to true to allow overwrites
          contentType
        });
      
      clearInterval(progressInterval);
      
      // Handle errors from the upload
      if (uploadResponse.error) {
        console.error('Upload error:', uploadResponse.error);
        
        // Try an alternative approach without contentType if that was the issue
        if (uploadResponse.error.message?.includes('mime type') && uploadResponse.error.message?.includes('not supported')) {
          console.log('Trying alternative upload without explicit content type...');
          
          const altUploadResponse = await supabase.storage
            .from(bucketName)
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (altUploadResponse.error) {
            throw new Error(`Alternative upload failed: ${altUploadResponse.error.message}`);
          }
          
          // If we got here, the alternative upload worked
          console.log('Alternative upload succeeded');
          uploadResponse = altUploadResponse;
        } else {
          throw new Error(uploadResponse.error.message);
        }
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
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
  
  // Utility function to ensure the bucket exists before uploading
  const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
    try {
      // Check if bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        throw new Error(`Error checking buckets: ${error.message}`);
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log(`Bucket ${bucketName} not found, creating it...`);
        
        // Create the bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800 // 50MB
        });
        
        if (createError) {
          if (createError.message?.includes('already exists')) {
            console.log('Bucket already exists but was not found in listBuckets. This is likely a permissions issue.');
            return true;
          }
          throw new Error(`Error creating bucket: ${createError.message}`);
        }
        
        console.log(`Successfully created ${bucketName} bucket`);
      }
      
      return true;
    } catch (err: any) {
      console.error('Error ensuring bucket exists:', err);
      // Don't throw here, just return false and let the upload attempt proceed
      return false;
    }
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
