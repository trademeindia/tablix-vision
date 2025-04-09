
import React, { memo } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MenuCategory } from '@/types/menu';

interface MenuCategoriesProps {
  categories: MenuCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

const MenuCategories: React.FC<MenuCategoriesProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  if (!categories.length) {
    return null;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 py-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            className={`rounded-full px-4 transition-all ${
              selectedCategory === category.id ? "shadow-md" : ""
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default memo(MenuCategories);
