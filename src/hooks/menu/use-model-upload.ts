import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

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
      const validExtensions = ['glb', 'gltf', 'jpg', 'jpeg', 'png', 'gif'];
      
      if (!validExtensions.includes(fileExt)) {
        setError(`Only ${validExtensions.join(', ')} files are supported`);
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
    if (!selectedFile || !restaurantId) {
      setError('Missing required information');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Create a new AbortController for this upload
      abortControllerRef.current = new AbortController();
      
      // Generate a unique file name with appropriate extension
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}_${uuidv4().substring(0, 8)}.${fileExt}`;
      const filePath = `menu-items/${restaurantId}/${menuItemId || 'new'}/${fileName}`;
      
      // Track upload progress manually since Supabase doesn't provide progress callbacks
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          // Simulate progress until we reach 90%
          if (prev < 90) {
            return prev + (Math.random() * 5);
          }
          return prev;
        });
      }, 300);
      
      // Determine media type
      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '');
      const is3DModel = ['glb', 'gltf'].includes(fileExt || '');
      const mediaType = isImage ? 'image' : (is3DModel ? '3d' : 'unknown');
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menu-media')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      clearInterval(progressInterval);
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('menu-media')
        .getPublicUrl(filePath);
        
      const fileUrl = publicUrlData.publicUrl;
      console.log('Successfully uploaded file:', fileUrl);
      
      setUploadProgress(100);
      setUploadSuccess(true);
      onUploadComplete(filePath, fileUrl);
      
      // Return early if this is a new item - the form will handle the rest
      if (!menuItemId || menuItemId === 'new') {
        return;
      }
      
      // Otherwise, update the existing menu item with the new media information
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({
          [mediaType === 'image' ? 'image_url' : 'model_url']: fileUrl,
          media_type: mediaType,
          media_reference: filePath,
          updated_at: new Date().toISOString()
        })
        .eq('id', menuItemId);
        
      if (updateError) {
        console.error('Error updating menu item with new media:', updateError);
        throw new Error(`Failed to update menu item: ${updateError.message}`);
      }
      
      toast({
        title: "Upload successful",
        description: `${mediaType === 'image' ? 'Image' : '3D model'} uploaded successfully`,
      });
      
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
      abortControllerRef.current = null;
    }
  }, [selectedFile, menuItemId, restaurantId, onUploadComplete]);
  
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current && isUploading) {
      abortControllerRef.current.abort();
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
