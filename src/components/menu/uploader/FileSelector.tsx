
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, X, CheckCircle2, AlertCircle, Image, Box } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileSelectorProps {
  selectedFile: File | null;
  isUploading: boolean;
  uploadSuccess: boolean;
  error: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  acceptedFileTypes?: string;
}

const FileSelector: React.FC<FileSelectorProps> = ({
  selectedFile,
  isUploading,
  uploadSuccess,
  error,
  onFileChange,
  onCancel,
  acceptedFileTypes = ".glb,.gltf,.jpg,.jpeg,.png,.gif"
}) => {
  // Helper function to determine file type for icon selection
  const getFileTypeIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['glb', 'gltf'].includes(extension || '')) {
      return <Box className="h-4 w-4 mr-2" />;
    }
    return <Image className="h-4 w-4 mr-2" />;
  };
  
  return (
    <div className="space-y-3">
      {!selectedFile && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-background">
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept={acceptedFileTypes}
            onChange={onFileChange}
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
            <span className="text-sm font-medium text-primary">Select file</span>
            <span className="mt-1 text-xs text-muted-foreground">
              {acceptedFileTypes.includes('.glb') 
                ? "Images (JPG, PNG, GIF) or 3D models (GLB, GLTF)" 
                : "Images (JPG, PNG, GIF)"}
              {" "}(max 50MB)
            </span>
          </label>
        </div>
      )}
      
      {selectedFile && !uploadSuccess && (
        <div className="flex items-center justify-between border rounded-lg p-3 bg-background">
          <div className="flex items-center overflow-hidden">
            {getFileTypeIcon(selectedFile)}
            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate text-foreground">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {!isUploading && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="text-foreground ml-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          )}
        </div>
      )}
      
      {uploadSuccess && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription>
            File uploaded successfully
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileSelector;
