
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
      
      // Generate a unique file name with appropriate extension
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `models/${restaurantId}/${menuItemId}-${uuidv4()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            const percentage = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percentage);
          }
        });
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
        
      const fileId = filePath;
      const fileUrl = publicUrlData.publicUrl;
      
      console.log('Successfully uploaded to Supabase Storage:', fileUrl);
      
      // Update menu item with Supabase Storage reference
      if (menuItemId !== 'new-item') {
        const { error: updateError } = await supabase
          .from('menu_items')
          .update({
            media_reference: fileId,
            model_url: fileUrl,
            media_type: '3d'
          })
          .eq('id', menuItemId);
          
        if (updateError) {
          console.error('Error updating menu item:', updateError);
          throw updateError;
        }
      }
      
      setUploadProgress(100);
      setUploadSuccess(true);
      onUploadComplete(fileId, fileUrl);
      
      toast({
        title: "Upload successful",
        description: "3D model uploaded successfully",
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
