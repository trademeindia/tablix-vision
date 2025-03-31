
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Spinner from '@/components/ui/spinner';
import MenuCategoriesTab from '@/components/menu/tabs/MenuCategoriesTab';
import MenuItemsTab from '@/components/menu/tabs/MenuItemsTab';
import { MenuCategory, MenuItem } from '@/types/menu';

interface MenuContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  isCategoriesLoading: boolean;
  isItemsLoading: boolean;
  onAddCategory: () => void;
  onEditCategory: (category: MenuCategory) => void;
  onDeleteCategory: (category: MenuCategory) => void;
  onAddItem: () => void;
  onViewItem: (id: string) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
}

const MenuContent: React.FC<MenuContentProps> = ({
  activeTab,
  setActiveTab,
  categories,
  menuItems,
  isCategoriesLoading,
  isItemsLoading,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onViewItem,
  onEditItem,
  onDeleteItem
}) => {
  if (isCategoriesLoading || isItemsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          <MenuItemsTab 
            items={menuItems} 
            categories={categories}
            isLoading={isItemsLoading}
            onAddItem={onAddItem}
            onViewItem={onViewItem}
            onEditItem={onEditItem}
            onDeleteItem={onDeleteItem}
          />
        </TabsContent>
        
        <TabsContent value="categories">
          <MenuCategoriesTab 
            categories={categories} 
            menuItems={menuItems}
            isLoading={isCategoriesLoading}
            onAddCategory={onAddCategory}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuContent;
