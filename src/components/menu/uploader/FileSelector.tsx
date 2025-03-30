
import React from 'react';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label 
            htmlFor="model-upload" 
            className={`cursor-pointer flex-1 flex items-center justify-center gap-2 rounded-md border ${uploadSuccess ? 'border-green-300 bg-green-50' : 'border-dashed border-input'} p-4 text-muted-foreground hover:bg-muted/50 transition-colors`}
          >
            {uploadSuccess ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-green-700">3D model uploaded successfully</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>{selectedFile ? selectedFile.name : 'Choose GLB or GLTF file'}</span>
              </>
            )}
            <input
              id="model-upload"
              type="file"
              className="hidden"
              accept=".glb,.gltf"
              onChange={onFileChange}
              disabled={isUploading || uploadSuccess}
            />
          </label>
          
          {selectedFile && !uploadSuccess && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCancel}
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          Upload a 3D model to showcase your menu item. Supported formats: GLB & GLTF. Max file size: 10MB. 
          Your model will be securely stored in Google Drive.
        </p>
      </div>
    </div>
  );
};

export default FileSelector;
