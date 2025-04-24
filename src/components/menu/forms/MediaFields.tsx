
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Image as ImageIcon } from 'lucide-react';
import ImageUploadFields from './media/ImageUploadFields';
import ModelUploadFields from './media/ModelUploadFields';

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
  const [activeTab, setActiveTab] = useState<string>('image');
  
  const imageUrl = form.watch('image_url');
  const modelUrl = form.watch('model_url');
  const mediaType = form.watch('media_type');
  
  const hasUploadedImage = mediaType === 'image' && !!imageUrl;
  const hasUploadedModel = mediaType === '3d' && !!modelUrl;
  
  useEffect(() => {
    if (mediaType === '3d') {
      setActiveTab('3d-model');
    } else {
      setActiveTab('image');
    }
  }, [mediaType]);

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
          <ImageUploadFields
            form={form}
            menuItemId={menuItemId}
            restaurantId={restaurantId}
            onUploadComplete={onUploadComplete}
            disabled={hasUploadedModel}
          />
        </TabsContent>
        
        <TabsContent value="3d-model" className="space-y-4 pt-4">
          <ModelUploadFields
            form={form}
            menuItemId={menuItemId}
            restaurantId={restaurantId}
            onUploadComplete={onUploadComplete}
            disabled={hasUploadedImage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaFields;
