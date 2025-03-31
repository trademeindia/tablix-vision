
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Spinner from '@/components/ui/spinner';
import MenuCategoriesTab from '@/components/menu/tabs/MenuCategoriesTab';
import MenuItemsTab from '@/components/menu/tabs/MenuItemsTab';
import { MenuCategory, MenuItem } from '@/types/menu';
import { useItemDialogs } from '@/hooks/menu/use-item-dialogs';
import ItemDialogs from '@/components/menu/dialogs/ItemDialogs';

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
  const {
    isAddOpen, setIsAddOpen,
    isEditOpen, setIsEditOpen,
    isDeleteOpen, setIsDeleteOpen,
    selectedItem, setSelectedItem
  } = useItemDialogs();

  if (isCategoriesLoading || isItemsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
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
      
      <ItemDialogs 
        isAddOpen={isAddOpen}
        setIsAddOpen={setIsAddOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        categories={categories}
        restaurantId="placeholder-restaurant-id" // This should be dynamically provided
        onRefreshCategories={() => {}} // This should be dynamically provided
      />
    </>
  );
};

export default MenuContent;
