
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MenuItem } from '@/types/menu';
import ModelViewer from '@/components/customer/menu/ModelViewer';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageOff, Box, Image } from 'lucide-react';

interface ViewItemDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: MenuItem | null;
}

const ViewItemDialog: React.FC<ViewItemDialogProps> = ({ 
  isOpen, 
  setIsOpen, 
  item 
}) => {
  const [activeTab, setActiveTab] = useState<string>(item?.media_type === '3d' ? '3d-model' : 'image');
  
  // Handle media type detection and tab switching
  React.useEffect(() => {
    if (item?.media_type === '3d') {
      setActiveTab('3d-model');
    } else {
      setActiveTab('image');
    }
  }, [item]);
  
  if (!item) return null;
  
  const has3DModel = item.media_type === '3d' && !!item.model_url;
  const hasImage = !!item.image_url;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Media content - show tabs if there's a 3D model */}
          {(hasImage || has3DModel) && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="image" disabled={!hasImage}>
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="3d-model" disabled={!has3DModel}>
                  <Box className="h-4 w-4 mr-2" />
                  3D Model
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="image" className="mt-4">
                {hasImage ? (
                  <div className="relative rounded-lg overflow-hidden aspect-video bg-slate-100">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.classList.add('image-error');
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center image-error-fallback">
                      <ImageOff className="h-8 w-8 text-slate-400" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[250px] bg-slate-100 rounded-lg">
                    <div className="text-center text-slate-500">
                      <ImageOff className="h-10 w-10 mx-auto mb-2" />
                      <p>No image available</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="3d-model" className="mt-4">
                {has3DModel ? (
                  <div className="relative rounded-lg overflow-hidden h-[350px] bg-slate-100">
                    <ModelViewer modelUrl={item.model_url!} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[250px] bg-slate-100 rounded-lg">
                    <div className="text-center text-slate-500">
                      <Box className="h-10 w-10 mx-auto mb-2" />
                      <p>No 3D model available</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {!hasImage && !has3DModel && (
            <div className="flex items-center justify-center h-[200px] bg-slate-100 rounded-lg">
              <div className="text-center text-slate-500">
                <ImageOff className="h-10 w-10 mx-auto mb-2" />
                <p>No media available</p>
              </div>
            </div>
          )}
          
          {/* Item details */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Price</h3>
              <p className="font-semibold">${item.price.toFixed(2)}</p>
            </div>
            
            {item.description && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">Description</h3>
                <p>{item.description}</p>
              </div>
            )}
            
            {/* Display dietary info */}
            <div>
              <h3 className="text-sm font-medium text-slate-500">Dietary Information</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {item.allergens?.isVegetarian && (
                  <Badge variant="outline" className="bg-green-50">Vegetarian</Badge>
                )}
                {item.allergens?.isVegan && (
                  <Badge variant="outline" className="bg-green-50">Vegan</Badge>
                )}
                {item.allergens?.isGlutenFree && (
                  <Badge variant="outline" className="bg-yellow-50">Gluten Free</Badge>
                )}
                {(!item.allergens?.isVegetarian && !item.allergens?.isVegan && !item.allergens?.isGlutenFree) && (
                  <span className="text-slate-500 text-sm">None specified</span>
                )}
              </div>
            </div>
            
            {/* Display allergens */}
            {item.allergens?.items && item.allergens.items.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">Allergens</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.allergens.items.map((allergen, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-slate-500">Status</h3>
              <Badge variant={item.is_available ? "default" : "secondary"}>
                {item.is_available ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewItemDialog;
