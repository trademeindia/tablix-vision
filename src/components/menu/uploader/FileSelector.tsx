
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileSelectorProps {
  selectedFile: File | null;
  isUploading: boolean;
  uploadSuccess: boolean;
  error: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({
  selectedFile,
  isUploading,
  uploadSuccess,
  error,
  onFileChange,
  onCancel
}) => {
  // Supported file types
  const acceptedFileTypes = ".glb,.gltf";
  
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
            <span className="text-sm font-medium text-primary">Select 3D model file</span>
            <span className="mt-1 text-xs text-muted-foreground">
              GLB or GLTF (max 50MB)
            </span>
          </label>
        </div>
      )}
      
      {selectedFile && !uploadSuccess && (
        <div className="flex items-center justify-between border rounded-lg p-3 bg-background">
          <div className="overflow-hidden">
            <p className="font-medium text-sm truncate text-foreground">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          {!isUploading && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="text-foreground"
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
