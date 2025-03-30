import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from '@/hooks/use-toast';
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadSuccess(false);
    
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    
    const file = e.target.files[0];
    
    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.glb') && !fileName.endsWith('.gltf')) {
      setError('Invalid file type. Only GLB and GLTF formats are supported.');
      setSelectedFile(null);
      return;
    }
    
    // Validate file size (10MB max)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 10MB.');
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile || !menuItemId || !restaurantId) {
      setError('Missing required data for upload');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('menuItemId', menuItemId);
      formData.append('restaurantId', restaurantId);
      
      setUploadProgress(30);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('upload-model', {
        body: formData,
      });
      
      setUploadProgress(90);
      
      if (error) {
        throw new Error(error.message || 'Upload failed');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }
      
      setUploadProgress(100);
      setUploadSuccess(true);
      
      // Call the callback with the file ID and URL
      onUploadComplete(data.fileId, data.fileUrl);
      
      toast({
        title: "Upload complete",
        description: "3D model has been uploaded successfully to Google Drive",
      });
      
      // Reset selected file but keep success state
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file');
      toast({
        title: "Upload failed",
        description: err.message || 'An error occurred during upload',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setError(null);
    setUploadSuccess(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
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
                onChange={handleFileChange}
                disabled={isUploading || uploadSuccess}
              />
            </label>
            
            {selectedFile && !uploadSuccess && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={cancelUpload}
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
      
      {selectedFile && !isUploading && !uploadSuccess && (
        <Button 
          onClick={uploadFile}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Model
        </Button>
      )}
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelUploader;
