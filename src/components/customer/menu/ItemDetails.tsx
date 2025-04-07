
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Box, Plus, Minus, Info } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { Badge } from '@/components/ui/badge';
import ModelViewer from './ModelViewer';
import { Suspense, lazy } from 'react';
import Spinner from '@/components/ui/spinner';

interface ItemDetailsProps {
  item: MenuItem;
  onAddToOrder?: (item: MenuItem) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onAddToOrder }) => {
  const [quantity, setQuantity] = useState(1);
  const [modelViewerOpen, setModelViewerOpen] = useState(false);
  
  const has3dModel = item.media_type === '3d' && item.model_url;
  
  const handleAddToOrder = () => {
    if (onAddToOrder) {
      onAddToOrder(item);
    }
  };
  
  const handleIncrement = () => {
    setQuantity(prev => Math.min(prev + 1, 10)); // Max 10 items
  };
  
  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, 1)); // Min 1 item
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="relative h-64 bg-slate-100">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No image available
          </div>
        )}
        
        {has3dModel && (
          <Button 
            size="sm"
            variant="secondary"
            className="absolute bottom-2 left-2 bg-black/70 hover:bg-black/90 text-white gap-1"
            onClick={() => setModelViewerOpen(true)}
          >
            <Box className="h-4 w-4" />
            View 3D Model
          </Button>
        )}
      </div>
      
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{item.name}</h3>
          <span className="text-lg font-medium">${item.price.toFixed(2)}</span>
        </div>
        
        {item.description && (
          <p className="text-gray-600 mb-4">{item.description}</p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-4">
          {item.allergens?.isVegetarian && (
            <Badge variant="outline" className="bg-green-50 text-green-700">Vegetarian</Badge>
          )}
          {item.allergens?.isVegan && (
            <Badge variant="outline" className="bg-green-50 text-green-700">Vegan</Badge>
          )}
          {item.allergens?.isGlutenFree && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700">Gluten Free</Badge>
          )}
        </div>
        
        {item.allergens?.items && item.allergens.items.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Contains:</p>
            <div className="flex flex-wrap gap-1">
              {item.allergens.items.map((allergen, index) => (
                <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {onAddToOrder && (
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleIncrement}
                disabled={quantity >= 10}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={handleAddToOrder} className="gap-2">
              <Plus className="h-4 w-4" />
              Add to Order
            </Button>
          </div>
        </div>
      )}
      
      {/* 3D Model Viewer Dialog */}
      <Dialog open={modelViewerOpen} onOpenChange={setModelViewerOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>3D Model View</DialogTitle>
          </DialogHeader>
          <div className="w-full aspect-square bg-slate-100 rounded-md overflow-hidden">
            {modelViewerOpen && item.model_url && (
              <Suspense fallback={
                <div className="h-full w-full flex items-center justify-center">
                  <Spinner size="lg" />
                  <span className="ml-2">Loading 3D model...</span>
                </div>
              }>
                <ModelViewer modelUrl={item.model_url} />
              </Suspense>
            )}
          </div>
          <div className="text-xs text-gray-500 flex items-start gap-2 mt-1">
            <Info className="h-3 w-3 shrink-0 mt-0.5" />
            <span>Pinch to zoom, drag to rotate</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemDetails;
