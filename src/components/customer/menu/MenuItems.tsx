
import React, { useState, memo, lazy, Suspense } from 'react';
import { MenuItem } from '@/types/menu';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye3d, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the ModelViewer component
const ModelViewer = lazy(() => import('@/components/customer/menu/ModelViewer'));

interface MenuItemsProps {
  items: MenuItem[];
  onAddToOrder: (item: MenuItem) => void;
}

const MenuItemSkeleton = () => (
  <div className="h-40 w-full bg-slate-100 animate-pulse rounded-md"></div>
);

const MenuItems: React.FC<MenuItemsProps> = ({ items, onAddToOrder }) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModelViewer, setShowModelViewer] = useState(false);
  
  if (!items.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No items available in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mb-16">
      {items.map((item) => {
        const allergens = item.allergens || {};
        const has3DModel = item.media_type === '3d' && item.model_url;
        
        return (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <div 
                  className="w-1/3 relative cursor-pointer"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowModelViewer(has3DModel);
                  }}
                >
                  {item.image_url ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover aspect-square"
                      />
                      {has3DModel && (
                        <div className="absolute bottom-1 right-1 bg-primary/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Eye3d className="h-3 w-3 mr-1" />
                          <span>3D</span>
                        </div>
                      )}
                    </div>
                  ) : has3DModel ? (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center aspect-square">
                      <Eye3d className="h-8 w-8 text-primary/70" />
                      <span className="absolute bottom-1 right-1 bg-primary/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Eye3d className="h-3 w-3 mr-1" />
                        3D
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center aspect-square">
                      <Image className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                </div>
                
                <div className="w-2/3 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {allergens.isVegetarian && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Veg
                        </Badge>
                      )}
                      {allergens.isVegan && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Vegan
                        </Badge>
                      )}
                      {allergens.isGlutenFree && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          GF
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button 
                      size="sm" 
                      onClick={() => onAddToOrder(item)}
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Order
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* 3D Model Viewer Dialog */}
      <Dialog open={showModelViewer} onOpenChange={setShowModelViewer}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          {selectedItem && selectedItem.model_url && showModelViewer && (
            <div className="w-full aspect-square bg-slate-100 relative rounded-md overflow-hidden">
              <Suspense fallback={<MenuItemSkeleton />}>
                <ModelViewer modelUrl={selectedItem.model_url} />
              </Suspense>
            </div>
          )}
          <div className="flex justify-between items-center pt-2">
            <p className="font-medium">${selectedItem?.price.toFixed(2)}</p>
            <Button onClick={() => {
              if (selectedItem) onAddToOrder(selectedItem);
              setShowModelViewer(false);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MenuItems);
