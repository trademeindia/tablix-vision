
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuCategoryCardProps {
  id: string;
  name: string;
  itemCount: number;
  icon?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MenuCategoryCard: React.FC<MenuCategoryCardProps> = ({
  id,
  name,
  itemCount,
  icon,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-stretch border-b border-slate-200">
          <div className="bg-slate-100 p-4 flex items-center justify-center">
            {icon ? (
              <img src={icon} alt={name} className="w-12 h-12 object-contain" />
            ) : (
              <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center text-slate-500">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-slate-500">{itemCount} items</p>
          </div>
        </div>
        
        <div className="flex items-center p-2 bg-white">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-slate-600"
            onClick={() => onEdit(id)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <div className="w-px h-6 bg-slate-200"></div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-slate-600"
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

export default MenuCategoryCard;
