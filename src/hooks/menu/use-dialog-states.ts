
import { useState } from 'react';
import { MenuCategory, MenuItem } from '@/types/menu';

export const useDialogStates = () => {
  // Category dialog states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  
  // Item dialog states
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Category action handlers
  const handleEditCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsEditCategoryOpen(true);
  };
  
  const handleDeleteCategoryClick = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsDeleteCategoryOpen(true);
  };
  
  // Item action handlers
  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditItemOpen(true);
  };
  
  const handleDeleteItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteItemOpen(true);
  };
  
  const handleViewItem = (id: string, items: MenuItem[]) => {
    const item = items.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setIsEditItemOpen(true);
    }
  };
  
  return {
    // Category dialog states
    isAddCategoryOpen,
    setIsAddCategoryOpen,
    isEditCategoryOpen,
    setIsEditCategoryOpen,
    isDeleteCategoryOpen,
    setIsDeleteCategoryOpen,
    selectedCategory,
    setSelectedCategory,
    
    // Item dialog states
    isAddItemOpen,
    setIsAddItemOpen,
    isEditItemOpen,
    setIsEditItemOpen,
    isDeleteItemOpen,
    setIsDeleteItemOpen,
    selectedItem,
    setSelectedItem,
    
    // Action handlers
    handleEditCategory,
    handleDeleteCategoryClick,
    handleEditItem,
    handleDeleteItemClick,
    handleViewItem
  };
};
