
import React from 'react';
import FileSelector from './uploader/FileSelector';
import UploadProgress from './uploader/UploadProgress';
import UploadButton from './uploader/UploadButton';
import { useModelUpload } from './uploader/useModelUpload';

interface ModelUploaderProps {
  menuItemId?: string;
  restaurantId?: string;
  onUploadComplete: (fileId: string, fileUrl: string) => void;
  className?: string;
}

const ModelUploader: React.FC<ModelUploaderProps> = ({ 
  menuItemId, 
  restaurantId,
  onUploadComplete,
  className 
}) => {
  const {
    isUploading,
    uploadProgress,
    error,
    selectedFile,
    uploadSuccess,
    handleFileChange,
    uploadFile,
    cancelUpload
  } = useModelUpload({
    menuItemId,
    restaurantId,
    onUploadComplete
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <FileSelector
        selectedFile={selectedFile}
        isUploading={isUploading}
        uploadSuccess={uploadSuccess}
        error={error}
        onFileChange={handleFileChange}
        onCancel={cancelUpload}
      />
      
      <UploadButton
        isVisible={!!selectedFile && !isUploading && !uploadSuccess}
        onUpload={uploadFile}
      />
      
      <UploadProgress
        isUploading={isUploading}
        progress={uploadProgress}
      />
    </div>
  );
};

export default ModelUploader;
