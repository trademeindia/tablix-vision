
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import ModelUploader from '../ModelUploader';

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
  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="model_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>3D Model URL</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input placeholder="https://..." {...field} readOnly={!!mediaReference} />
              </FormControl>
              {field.value && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => window.open(field.value, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
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
      
      {/* 3D Model Uploader */}
      {menuItemId && (
        <ModelUploader
          menuItemId={menuItemId}
          restaurantId={restaurantId || form.getValues('restaurant_id')}
          onUploadComplete={onUploadComplete}
          className="pt-2"
        />
      )}
    </div>
  );
};

export default MediaFields;
