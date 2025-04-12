
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Upload, Box } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import SupabaseModelUploader from '../uploader/SupabaseModelUploader';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { lazy, Suspense } from 'react';
import Spinner from '@/components/ui/spinner';

// Lazy load the ModelViewer component
const ModelViewer = lazy(() => import('@/components/customer/menu/ModelViewer'));

interface MediaFieldsProps {
  form: UseFormReturn<any>;
  mediaReference: string;
  mediaUrl: string;
  menuItemId?: string;
  restaurantId?: string;
  onUploadComplete: (fileId: string, fileUrl: string) => void;
}

const MediaFields: React.FC<MediaFieldsProps> = ({ 
  form, 
  mediaReference, 
  mediaUrl, 
  menuItemId, 
  restaurantId, 
  onUploadComplete 
}) => {
  const [showModelPreview, setShowModelPreview] = useState(false);
  const modelUrl = form.getValues('model_url');
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                URL to a 2D image of the menu item
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="model_url"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FormLabel className="mt-0">3D Model URL</FormLabel>
                {mediaReference && (
                  <Badge variant="outline" className="bg-green-50">
                    <Upload className="h-3 w-3 mr-1" />
                    Media Uploaded
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="https://..." {...field} readOnly={!!mediaReference} />
                </FormControl>
                {field.value && (
                  <div className="flex gap-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => window.open(field.value, '_blank')}
                      title="Open in new tab"
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
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-md font-medium mb-4">Upload 3D Model</h3>
        <SupabaseModelUploader
          menuItemId={menuItemId}
          restaurantId={restaurantId}
          onUploadComplete={onUploadComplete}
        />
      </div>
      
      {/* 3D Model Preview Dialog */}
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
