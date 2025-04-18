import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Upload, Box, Image as ImageIcon } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import SupabaseModelUploader from '../uploader/SupabaseModelUploader';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { lazy, Suspense } from 'react';
import Spinner from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseUpload } from '@/hooks/menu/use-supabase-upload';
import { toast } from '@/hooks/use-toast';

const ModelViewer = lazy(() => import('@/components/customer/menu/ModelViewer'));

interface MediaFieldsProps {
  form: UseFormReturn<any>;
  menuItemId?: string;
  restaurantId?: string;
  mediaReference?: string;
  mediaUrl?: string;
  onUploadComplete: (fileId: string, fileUrl: string) => void;
}

const MediaFields: React.FC<MediaFieldsProps> = ({ 
  form, 
  menuItemId, 
  restaurantId, 
  mediaReference,
  mediaUrl,
  onUploadComplete 
}) => {
  const [showModelPreview, setShowModelPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('image');
  
  const imageUrl = form.watch('image_url');
  const modelUrl = form.watch('model_url');
  const mediaType = form.watch('media_type');
  const formMediaReference = form.watch('media_reference');
  
  const hasUploadedImage = mediaType === 'image' && !!imageUrl;
  const hasUploadedModel = mediaType === '3d' && !!modelUrl && !!(formMediaReference || mediaReference);
  const hasUploaded = hasUploadedImage || hasUploadedModel;

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
    allowedFileTypes: activeTab === 'image' 
      ? ['.jpg', '.jpeg', '.png', '.gif'] 
      : ['.glb', '.gltf']
  });

  useEffect(() => {
    if (mediaType === '3d') {
      setActiveTab('3d-model');
    } else {
      setActiveTab('image');
    }
  }, [mediaType]);

  const handleUploadComplete = async () => {
    if (!selectedFile) return;
    
    try {
      toast({
        title: "Uploading file",
        description: "Please wait while your file is being uploaded...",
      });
      
      const result = await uploadFile();
      if (!result) {
        toast({
          title: "Upload failed",
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      const { path, url } = result;
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const is3DModel = fileExt === 'glb' || fileExt === 'gltf';
      
      console.log(`Upload successful: ${is3DModel ? '3D Model' : 'Image'} at ${url}`);
      
      if (is3DModel) {
        form.setValue('model_url', url);
        form.setValue('image_url', '');
        form.setValue('media_type', '3d');
        form.setValue('media_reference', path);
      } else {
        form.setValue('image_url', url);
        form.setValue('model_url', '');
        form.setValue('media_type', 'image');
        form.setValue('media_reference', path);
      }
      
      onUploadComplete(path, url);
      
      toast({
        title: "Upload successful",
        description: `Your ${is3DModel ? '3D model' : 'image'} has been uploaded successfully.`,
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error in handleUploadComplete:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to complete upload process",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image" disabled={hasUploadedModel}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Image
          </TabsTrigger>
          <TabsTrigger value="3d-model" disabled={hasUploadedImage}>
            <Box className="h-4 w-4 mr-2" />
            3D Model
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image" className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      placeholder="https://... or upload below" 
                      {...field} 
                      readOnly={hasUploadedImage}
                    />
                  </FormControl>
                  {field.value && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => window.open(field.value, '_blank')}
                      title="Open image in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormDescription>
                  URL to an image (JPG, PNG, GIF)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="border rounded-lg p-4">
            <h3 className="text-md font-medium mb-2">Upload Image</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a JPG, PNG, or GIF image. This will replace any manually entered URL above.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  disabled={isUploading || hasUploadedModel}
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
        </TabsContent>
        
        <TabsContent value="3d-model" className="space-y-4 pt-4">
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
                      readOnly={hasUploadedModel || hasUploadedImage} 
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
                  disabled={isUploading || hasUploadedImage}
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
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">3D Model Tips</h3>
            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
              <li>Use compressed GLB files for better performance</li>
              <li>Keep file size under 10MB for optimal loading</li>
              <li>Make sure your model has proper lighting and materials</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
      
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

export default MediaFields;
