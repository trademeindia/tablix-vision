
import React, { useState } from 'react';
import { MenuItem } from '@/types/menu';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Box, ImageOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { lazy, Suspense } from 'react';
import { toast } from '@/hooks/use-toast';
import Spinner from '@/components/ui/spinner';

const ModelViewer = lazy(() => import('./ModelViewer'));

interface MenuItemsProps {
  items: MenuItem[];
  categoryId?: string;
  onAddToOrder: (item: MenuItem) => void;
}

const MenuItems: React.FC<MenuItemsProps> = ({ items, categoryId, onAddToOrder }) => {
  const [modelViewerOpen, setModelViewerOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  
  const filteredItems = categoryId 
    ? items.filter(item => item.category_id === categoryId)
    : items;
    
  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        No items found in this category
      </div>
    );
  }

  const openModelViewer = (modelUrl: string) => {
    if (!modelUrl) {
      toast({
        title: "No 3D model available",
        description: "This item doesn't have a 3D model to display",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedModel(modelUrl);
    setModelViewerOpen(true);
  };
  
  // Fix the event handler with proper type annotations
  const handleImageError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    const img = event.currentTarget;
    img.classList.add('hidden');
    if (img.parentElement) {
      img.parentElement.classList.add('image-error');
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const hasImage = !!item.image_url;
          const has3dModel = item.media_type === '3d' && !!item.model_url;
          
          return (
            <Card key={item.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                {item.image_url ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center image-error-fallback opacity-0">
                      <ImageOff className="h-8 w-8 text-slate-400" />
                    </div>
                  </div>
                ) : ( 
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    {has3dModel ? <Box className="h-8 w-8" /> : <ImageOff className="h-8 w-8" />}
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex flex-wrap gap-1 z-10">
                  {item.allergens?.isVegetarian && (
                    <Badge variant="success" className="bg-green-100 text-green-800">Veg</Badge>
                  )}
                  {item.allergens?.isVegan && (
                    <Badge variant="success" className="bg-green-100 text-green-800">Vegan</Badge>
                  )}
                  {item.allergens?.isGlutenFree && (
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200">GF</Badge>
                  )}
                </div>
                
                {has3dModel && (
                  <Button 
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-2 left-2 bg-black/70 hover:bg-black/90 text-white gap-1 py-1 px-2 h-auto z-10"
                    onClick={() => openModelViewer(item.model_url as string)}
                  >
                    <Box className="h-3 w-3" />
                    View 3D
                  </Button>
                )}
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium text-foreground">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                )}
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="font-semibold text-foreground">${item.price.toFixed(2)}</span>
                  <Button 
                    size="sm" 
                    onClick={() => onAddToOrder(item)}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      <Dialog 
        open={modelViewerOpen} 
        onOpenChange={(open) => {
          if (!open) setModelViewerOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>3D Model Viewer</DialogTitle>
          </DialogHeader>
          <div className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden">
            {modelViewerOpen && selectedModel && (
              <Suspense fallback={
                <div className="h-full w-full flex items-center justify-center">
                  <Spinner size="lg" />
                  <span className="ml-2">Loading 3D model...</span>
                </div>
              }>
                <ModelViewer modelUrl={selectedModel} />
              </Suspense>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style>
        {`
          .image-error .image-error-fallback {
            opacity: 1 !important;
          }
          .hidden {
            display: none;
          }
        `}
      </style>
    </>
  );
};

export default MenuItems;
