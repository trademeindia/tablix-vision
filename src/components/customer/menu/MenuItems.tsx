import React, { useState } from 'react';
import { MenuItem } from '@/types/menu';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Box } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { lazy, Suspense } from 'react';

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
    setSelectedModel(modelUrl);
    setModelViewerOpen(true);
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden h-full flex flex-col">
            <div className="relative h-40 bg-slate-100 overflow-hidden">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No image
                </div>
              )}
              
              {/* Diet badges */}
              <div className="absolute top-2 right-2 flex flex-wrap gap-1">
                {item.allergens?.isVegetarian && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Veg</Badge>
                )}
                {item.allergens?.isVegan && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Vegan</Badge>
                )}
                {item.allergens?.isGlutenFree && (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700">GF</Badge>
                )}
              </div>
              
              {/* 3D model indicator */}
              {item.media_type === '3d' && item.model_url && (
                <Button 
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-2 left-2 bg-black/70 hover:bg-black/90 text-white gap-1 py-1 px-2 h-auto"
                  onClick={() => openModelViewer(item.model_url as string)}
                >
                  <Box className="h-3 w-3" />
                  View 3D
                </Button>
              )}
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-medium">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.description}</p>
              )}
              <div className="mt-auto pt-3 flex items-center justify-between">
                <span className="font-semibold">${item.price.toFixed(2)}</span>
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
        ))}
      </div>
      
      {/* 3D Model Viewer Dialog */}
      <Dialog open={modelViewerOpen} onOpenChange={setModelViewerOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>3D Model Viewer</DialogTitle>
          </DialogHeader>
          <div className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden">
            {modelViewerOpen && (
              <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading 3D model...</div>}>
                <ModelViewer modelUrl={selectedModel} />
              </Suspense>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuItems;
