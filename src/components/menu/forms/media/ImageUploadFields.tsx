
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Upload } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import { useSupabaseUpload } from '@/hooks/menu/use-supabase-upload';

interface ImageUploadFieldsProps {
  form: UseFormReturn<any>;
  onUploadComplete: (fileId: string, fileUrl: string) => void;
  menuItemId?: string;
  restaurantId?: string;
  disabled?: boolean;
}

const ImageUploadFields: React.FC<ImageUploadFieldsProps> = ({
  form,
  onUploadComplete,
  menuItemId,
  restaurantId,
  disabled
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
  } = useSupabaseUpload({
    bucketName: 'menu-media',
    restaurantId,
    itemId: menuItemId,
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif']
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
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input 
                  placeholder="https://... or upload below" 
                  {...field} 
                  readOnly={disabled}
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
    </div>
  );
};

export default ImageUploadFields;
