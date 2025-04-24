
import React, { useCallback, useEffect, useState } from 'react';
import FileSelector from './FileSelector';
import UploadProgress from './UploadProgress';
import UploadButton from './UploadButton';
import { useSupabaseUpload } from '@/hooks/menu/use-supabase-upload';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { initializeStorage } from '@/hooks/menu/use-create-storage-bucket';

interface SupabaseModelUploaderProps {
  menuItemId?: string;
  restaurantId?: string;
  onUploadComplete: (path: string, url: string) => void;
  className?: string;
  allowedFileTypes?: string[];
}

const SupabaseModelUploader: React.FC<SupabaseModelUploaderProps> = ({ 
  menuItemId, 
  restaurantId,
  onUploadComplete,
  className,
  allowedFileTypes
}) => {
  const [isStorageInitialized, setIsStorageInitialized] = useState(false);
  
  // Initialize storage bucket when component mounts
  useEffect(() => {
    const setupStorage = async () => {
      const initialized = await initializeStorage();
      setIsStorageInitialized(initialized);
      if (!initialized) {
        console.error('Failed to initialize storage bucket');
      }
    };
    
    setupStorage();
  }, []);
  
  const {
    isUploading,
    uploadProgress,
    error,
    selectedFile,
    uploadSuccess,
    handleFileChange,
    uploadFile,
    cancelUpload
  } = useSupabaseUpload({
    restaurantId,
    itemId: menuItemId,
    bucketName: 'menu-media',
    allowedFileTypes: allowedFileTypes || ['.glb', '.gltf']
  });
  
  const handleUpload = useCallback(async () => {
    if (!isStorageInitialized) {
      const initialized = await initializeStorage();
      setIsStorageInitialized(initialized);
      if (!initialized) {
        console.error('Storage initialization failed. Please try again.');
        return;
      }
    }
    
    const result = await uploadFile();
    if (result) {
      onUploadComplete(result.path, result.url);
    }
  }, [uploadFile, onUploadComplete, isStorageInitialized]);

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <FileSelector
        selectedFile={selectedFile}
        isUploading={isUploading}
        uploadSuccess={uploadSuccess}
        error={error}
        onFileChange={handleFileChange}
        onCancel={cancelUpload}
        acceptedFileTypes={allowedFileTypes?.join(',') || ".glb,.gltf"}
      />
      
      <UploadButton
        isVisible={!!selectedFile && !isUploading && !uploadSuccess}
        onUpload={handleUpload}
      />
      
      <UploadProgress
        isUploading={isUploading}
        progress={uploadProgress}
        onCancel={cancelUpload}
      />
      
      {!uploadSuccess && !isUploading && (
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-3 flex items-start text-xs text-blue-700">
            <Info className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Upload Tips:</p>
              <ul className="mt-1 space-y-1 list-disc pl-4">
                <li>Use compressed GLB files when possible (smaller file size)</li>
                <li>Optimize your models before uploading (reduce polygons, texture size)</li>
                <li>For best performance, keep models under 10MB</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupabaseModelUploader;
