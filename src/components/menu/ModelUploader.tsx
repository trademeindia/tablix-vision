
import React from 'react';
import FileSelector from './uploader/FileSelector';
import UploadProgress from './uploader/UploadProgress';
import UploadButton from './uploader/UploadButton';
import { useModelUpload } from './uploader/useModelUpload';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

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

export default ModelUploader;
