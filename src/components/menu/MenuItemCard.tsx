
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
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
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="h-40 relative">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500">
              No Image
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-1">
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
            <Eye className="h-4 w-4 mr-2" />
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
    </Card>
  );
};

export default MenuItemCard;
