
import React from 'react';
import CategoryDialogs from '@/components/menu/dialogs/CategoryDialogs';
import ItemDialogs from '@/components/menu/dialogs/ItemDialogs';
import { MenuCategory, MenuItem } from '@/types/menu';

interface MenuDialogsContainerProps {
  // Category dialog states
  isAddCategoryOpen: boolean;
  setIsAddCategoryOpen: (open: boolean) => void;
  isEditCategoryOpen: boolean;
  setIsEditCategoryOpen: (open: boolean) => void;
  isDeleteCategoryOpen: boolean;
  setIsDeleteCategoryOpen: (open: boolean) => void;
  selectedCategory: MenuCategory | null;
  setSelectedCategory: (category: MenuCategory | null) => void;
  
  // Item dialog states
  isAddItemOpen: boolean;
  setIsAddItemOpen: (open: boolean) => void;
  isEditItemOpen: boolean;
  setIsEditItemOpen: (open: boolean) => void;
  isDeleteItemOpen: boolean;
  setIsDeleteItemOpen: (open: boolean) => void;
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
  
  // Data
  categories: MenuCategory[];
  restaurantId: string;
  onRefreshData: () => void;
  usingTestData: boolean;
}

const MenuDialogsContainer: React.FC<MenuDialogsContainerProps> = ({
  isAddCategoryOpen,
  setIsAddCategoryOpen,
  isEditCategoryOpen,
  setIsEditCategoryOpen,
  isDeleteCategoryOpen,
  setIsDeleteCategoryOpen,
  selectedCategory,
  setSelectedCategory,
  
  isAddItemOpen,
  setIsAddItemOpen,
  isEditItemOpen,
  setIsEditItemOpen,
  isDeleteItemOpen,
  setIsDeleteItemOpen,
  selectedItem,
  setSelectedItem,
  
  categories,
  restaurantId,
  onRefreshData,
  usingTestData
}) => {
  return (
    <>
      <CategoryDialogs 
        isAddOpen={isAddCategoryOpen}
        setIsAddOpen={setIsAddCategoryOpen}
        isEditOpen={isEditCategoryOpen}
        setIsEditOpen={setIsEditCategoryOpen}
        isDeleteOpen={isDeleteCategoryOpen}
        setIsDeleteOpen={setIsDeleteCategoryOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        restaurantId={restaurantId}
      />
      
      <ItemDialogs 
        isAddOpen={isAddItemOpen}
        setIsAddOpen={setIsAddItemOpen}
        isEditOpen={isEditItemOpen}
        setIsEditOpen={setIsEditItemOpen}
        isDeleteOpen={isDeleteItemOpen}
        setIsDeleteOpen={setIsDeleteItemOpen}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        categories={categories}
        restaurantId={restaurantId}
        onRefreshCategories={onRefreshData}
        usingTestData={usingTestData}
      />
    </>
  );
};

export default MenuDialogsContainer;
