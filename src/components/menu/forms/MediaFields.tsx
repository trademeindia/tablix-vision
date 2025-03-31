
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Upload, Eye3d } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import ModelUploader from '../ModelUploader';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { lazy, Suspense } from 'react';

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
                    Uploaded to Drive
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
                      <Eye3d className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <FormDescription>
                {mediaReference 
                  ? "A 3D model has been uploaded to Google Drive" 
                  : "Enter a URL or upload a 3D model below"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Hidden fields for media type and reference */}
      <FormField
        control={form.control}
        name="media_type"
        render={({ field }) => (
          <input 
            type="hidden" 
            {...field} 
            value={field.value || undefined}
          />
        )}
      />
      
      <FormField
        control={form.control}
        name="media_reference"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
      
      {/* 3D Model Uploader */}
      <div className="border rounded-lg p-4 bg-slate-50">
        <h3 className="text-sm font-medium mb-3">3D Model Upload</h3>
        <ModelUploader
          menuItemId={menuItemId || 'new-item'}
          restaurantId={restaurantId || form.getValues('restaurant_id')}
          onUploadComplete={onUploadComplete}
        />
        <p className="text-xs text-muted-foreground mt-3">
          Models will be securely stored in your restaurant's Google Drive folder
        </p>
      </div>

      {/* Model Preview Dialog */}
      <Dialog open={showModelPreview} onOpenChange={setShowModelPreview}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>3D Model Preview</DialogTitle>
          </DialogHeader>
          <div className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden">
            <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading model...</div>}>
              <ModelViewer modelUrl={form.getValues('model_url')} />
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaFields;
