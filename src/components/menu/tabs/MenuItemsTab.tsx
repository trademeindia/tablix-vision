
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MenuItemCard from '@/components/menu/MenuItemCard';
import { MenuCategory, MenuItem } from '@/types/menu';

interface MenuItemsTabProps {
  items: MenuItem[];
  categories: MenuCategory[];
  isLoading: boolean;
  onAddItem: () => void;
  onViewItem: (id: string) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
}

const MenuItemsTab: React.FC<MenuItemsTabProps> = ({ 
  items, 
  categories,
  isLoading, 
  onAddItem,
  onViewItem,
  onEditItem,
  onDeleteItem 
}) => {
  if (isLoading) {
    return <div className="text-center py-10">Loading menu items...</div>;
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500 mb-4">No menu items found</p>
        <Button onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Menu Item
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const allergens = item.allergens || {};
        
        return (
          <MenuItemCard 
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            category={
              categories.find(cat => cat.id === item.category_id)?.name || 'Uncategorized'
            }
            image={item.image_url || ''}
            isVegetarian={allergens.isVegetarian}
            isVegan={allergens.isVegan}
            isGlutenFree={allergens.isGlutenFree}
            mediaType={item.media_type}
            onView={() => onViewItem(item.id)}
            onEdit={() => onEditItem(item)}
            onDelete={() => onDeleteItem(item)}
          />
        );
      })}
    </div>
  );
};

export default MenuItemsTab;
