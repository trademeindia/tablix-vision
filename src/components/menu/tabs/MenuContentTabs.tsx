
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MenuCategoriesTab from '@/components/menu/tabs/MenuCategoriesTab';
import MenuItemsTab from '@/components/menu/tabs/MenuItemsTab';
import { MenuCategory, MenuItem } from '@/types/menu';

interface MenuContentTabsProps {
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

const MenuContentTabs: React.FC<MenuContentTabsProps> = ({
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
  return (
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
  );
};

export default MenuContentTabs;
