
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MenuCategoryCard from '@/components/menu/MenuCategoryCard';
import { MenuCategory, MenuItem } from '@/types/menu';

interface MenuCategoriesTabProps {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  isLoading: boolean;
  onAddCategory: () => void;
  onEditCategory: (category: MenuCategory) => void;
  onDeleteCategory: (category: MenuCategory) => void;
}

const MenuCategoriesTab: React.FC<MenuCategoriesTabProps> = ({ 
  categories, 
  menuItems,
  isLoading, 
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  if (isLoading) {
    return <div className="text-center py-10">Loading categories...</div>;
  }
  
  if (categories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500 mb-4">No categories found</p>
        <Button onClick={onAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Category
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const itemCount = menuItems.filter(item => item.category_id === category.id).length;
        return (
          <MenuCategoryCard 
            key={category.id}
            id={category.id}
            name={category.name}
            itemCount={itemCount}
            onEdit={() => onEditCategory(category)}
            onDelete={() => onDeleteCategory(category)}
          />
        );
      })}
    </div>
  );
};

export default MenuCategoriesTab;
