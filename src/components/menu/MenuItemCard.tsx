
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Box, ImageOff, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItemCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  mediaType?: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  price,
  category,
  image,
  isVegetarian,
  isVegan,
  isGlutenFree,
  mediaType,
  onView,
  onEdit,
  onDelete,
}) => {
  const has3DModel = mediaType === '3d';
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    img.classList.add('hidden');
    if (img.parentElement) {
      img.parentElement.classList.add('image-error');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="h-40 relative">
          {image ? (
            <div className="relative w-full h-full">
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center image-error-fallback opacity-0">
                <ImageOff className="h-8 w-8 text-slate-400" />
              </div>
              {has3DModel && (
                <div className="absolute top-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Box className="h-3 w-3 mr-1" />
                  <span>3D</span>
                </div>
              )}
              
              {has3DModel && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <RotateCw className="h-3 w-3 mr-1" />
                  <span>Rotate</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 relative">
              {has3DModel ? (
                <>
                  <Box className="h-8 w-8 text-primary/70" />
                  <div className="absolute top-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Box className="h-3 w-3 mr-1" />
                    <span>3D</span>
                  </div>
                </>
              ) : (
                <ImageOff className="h-8 w-8 text-slate-400" />
              )}
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex flex-wrap gap-1">
            {isVegetarian && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Veg
              </Badge>
            )}
            {isVegan && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Vegan
              </Badge>
            )}
            {isGlutenFree && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                GF
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium">{name}</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-slate-500">{category}</p>
            <p className="font-medium">${price.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="flex items-center border-t border-slate-200">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-slate-600 rounded-none py-2"
            onClick={() => onView(id)}
          >
            {has3DModel ? <Box className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            View
          </Button>
          <div className="w-px h-6 bg-slate-200"></div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-slate-600 rounded-none py-2"
            onClick={() => onEdit(id)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <div className="w-px h-6 bg-slate-200"></div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-slate-600 rounded-none py-2"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>

      <style>{`
        .image-error .image-error-fallback {
          opacity: 1;
        }
      `}</style>
    </Card>
  );
};

export default MenuItemCard;
