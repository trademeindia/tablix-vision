
import React from 'react';
import { MenuCategory, MenuItem } from '@/types/menu';
import AddItemDialog from './item/AddItemDialog';
import EditItemDialog from './item/EditItemDialog';
import DeleteItemDialog from './item/DeleteItemDialog';

interface ItemDialogsProps {
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
  categories: MenuCategory[];
  restaurantId: string;
  onRefreshCategories?: () => void;
  usingTestData?: boolean;
}

const ItemDialogs: React.FC<ItemDialogsProps> = ({ 
  isAddOpen, 
  setIsAddOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  selectedItem,
  setSelectedItem,
  categories,
  restaurantId,
  onRefreshCategories,
  usingTestData = false
}) => {
  // Use React.memo for these dialogs to prevent unnecessary re-renders
  const MemoizedAddItemDialog = React.useMemo(() => (
    <AddItemDialog
      isOpen={isAddOpen}
      setIsOpen={setIsAddOpen}
      categories={categories}
      restaurantId={restaurantId}
      onRefreshCategories={onRefreshCategories}
      usingTestData={usingTestData}
    />
  ), [isAddOpen, setIsAddOpen, categories, restaurantId, onRefreshCategories, usingTestData]);
  
  const MemoizedEditItemDialog = React.useMemo(() => (
    <EditItemDialog
      isOpen={isEditOpen}
      setIsOpen={setIsEditOpen}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
      categories={categories}
      restaurantId={restaurantId}
      onRefreshCategories={onRefreshCategories}
      usingTestData={usingTestData}
    />
  ), [isEditOpen, setIsEditOpen, selectedItem, setSelectedItem, categories, restaurantId, onRefreshCategories, usingTestData]);

  const MemoizedDeleteItemDialog = React.useMemo(() => (
    <DeleteItemDialog
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
      usingTestData={usingTestData}
    />
  ), [isDeleteOpen, setIsDeleteOpen, selectedItem, setSelectedItem, usingTestData]);

  return (
    <>
      {MemoizedAddItemDialog}
      {MemoizedEditItemDialog}
      {MemoizedDeleteItemDialog}
    </>
  );
};

export default React.memo(ItemDialogs);

