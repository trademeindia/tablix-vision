
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Box, Upload } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { lazy, Suspense } from 'react';
import Spinner from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useSupabaseUpload } from '@/hooks/menu/use-supabase-upload';

const ModelViewer = lazy(() => import('@/components/customer/menu/ModelViewer'));

interface ModelUploadFieldsProps {
  form: UseFormReturn<any>;
  onUploadComplete: (fileId: string, fileUrl: string) => void;
  menuItemId?: string;
  restaurantId?: string;
  disabled?: boolean;
}

const ModelUploadFields: React.FC<ModelUploadFieldsProps> = ({
  form,
  onUploadComplete,
  menuItemId,
  restaurantId,
  disabled
}) => {
  const [showModelPreview, setShowModelPreview] = useState(false);
  const modelUrl = form.watch('model_url');
  const hasUploadedModel = !!modelUrl;

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
    bucketName: 'menu-media',
    restaurantId,
    itemId: menuItemId,
    allowedFileTypes: ['.glb', '.gltf']
  });

  const handleUploadComplete = async () => {
    if (!selectedFile) return;
    const result = await uploadFile();
    if (result) {
      onUploadComplete(result.path, result.url);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="model_url"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2 mb-1.5">
              <FormLabel className="mt-0">3D Model URL</FormLabel>
              {hasUploadedModel && (
                <Badge variant="outline" className="bg-green-50">
                  <Upload className="h-3 w-3 mr-1" />
                  3D Model Uploaded
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <FormControl>
                <Input 
                  placeholder="https://... or upload below" 
                  {...field} 
                  readOnly={disabled || hasUploadedModel} 
                />
              </FormControl>
              {field.value && (
                <div className="flex gap-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => window.open(field.value, '_blank')}
                    title="Open 3D model in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowModelPreview(true)}
                    title="Preview 3D model"
                  >
                    <Box className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <FormDescription>
              URL to a 3D model (.glb or .gltf file)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="border rounded-lg p-4">
        <h3 className="text-md font-medium mb-2">Upload 3D Model</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a GLB or GLTF 3D model. This will replace any manually entered URL above.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              id="model-upload"
              type="file"
              accept=".glb,.gltf"
              onChange={handleFileChange}
              disabled={isUploading || disabled}
            />
            
            {selectedFile && !uploadSuccess && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleUploadComplete}
                disabled={isUploading || !selectedFile}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            )}
            
            {isUploading && (
              <Button
                type="button"
                variant="destructive"
                onClick={cancelUpload}
              >
                Cancel
              </Button>
            )}
          </div>
          
          {isUploading && (
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-muted-foreground mt-1">
                Uploading: {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
          
          {error && (
            <p className="text-sm text-destructive">
              Error: {error}
            </p>
          )}
          
          {uploadSuccess && (
            <p className="text-sm text-green-600 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Upload successful!
            </p>
          )}
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="p-3 flex items-start text-xs text-blue-700">
          <Info className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">3D Model Tips:</p>
            <ul className="mt-1 space-y-1 list-disc pl-4">
              <li>Use compressed GLB files for better performance</li>
              <li>Keep file size under 10MB for optimal loading</li>
              <li>Make sure your model has proper lighting and materials</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModelPreview} onOpenChange={setShowModelPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>3D Model Preview</DialogTitle>
          </DialogHeader>
          {showModelPreview && modelUrl && (
            <div className="h-full">
              <Suspense fallback={<div className="flex items-center justify-center h-full"><Spinner size="lg" /></div>}>
                <ModelViewer modelUrl={modelUrl} />
              </Suspense>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModelUploadFields;
