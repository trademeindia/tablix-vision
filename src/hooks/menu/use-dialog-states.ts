
import { useState, useCallback } from 'react';
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
  
  // Safety check to ensure only one dialog is open at a time
  const ensureSingleDialog = useCallback((type: 'item' | 'category', action: 'add' | 'edit' | 'delete') => {
    if (type === 'item') {
      // Close other item dialogs
      if (action !== 'add') setIsAddItemOpen(false);
      if (action !== 'edit') setIsEditItemOpen(false);
      if (action !== 'delete') setIsDeleteItemOpen(false);
      
      // Close all category dialogs
      setIsAddCategoryOpen(false);
      setIsEditCategoryOpen(false);
      setIsDeleteCategoryOpen(false);
    } else {
      // Close all item dialogs
      setIsAddItemOpen(false);
      setIsEditItemOpen(false);
      setIsDeleteItemOpen(false);
      
      // Close other category dialogs
      if (action !== 'add') setIsAddCategoryOpen(false);
      if (action !== 'edit') setIsEditCategoryOpen(false);
      if (action !== 'delete') setIsDeleteCategoryOpen(false);
    }
  }, []);
  
  // Category action handlers
  const handleEditCategory = useCallback((category: MenuCategory) => {
    setSelectedCategory(category);
    ensureSingleDialog('category', 'edit');
    setIsEditCategoryOpen(true);
  }, [ensureSingleDialog]);
  
  const handleDeleteCategoryClick = useCallback((category: MenuCategory) => {
    setSelectedCategory(category);
    ensureSingleDialog('category', 'delete');
    setIsDeleteCategoryOpen(true);
  }, [ensureSingleDialog]);
  
  // Item action handlers
  const handleEditItem = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    ensureSingleDialog('item', 'edit');
    setIsEditItemOpen(true);
  }, [ensureSingleDialog]);
  
  const handleDeleteItemClick = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    ensureSingleDialog('item', 'delete');
    setIsDeleteItemOpen(true);
  }, [ensureSingleDialog]);
  
  const handleViewItem = useCallback((id: string, items: MenuItem[]) => {
    const item = items.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      ensureSingleDialog('item', 'edit');
      setIsEditItemOpen(true);
    }
  }, [ensureSingleDialog]);
  
  // Safe setters that ensure only one dialog is open
  const safeSetIsAddCategoryOpen = useCallback((value: boolean) => {
    if (value) ensureSingleDialog('category', 'add');
    setIsAddCategoryOpen(value);
  }, [ensureSingleDialog]);
  
  const safeSetIsEditCategoryOpen = useCallback((value: boolean) => {
    if (value) ensureSingleDialog('category', 'edit');
    setIsEditCategoryOpen(value);
  }, [ensureSingleDialog]);
  
  const safeSetIsDeleteCategoryOpen = useCallback((value: boolean) => {
    if (value) ensureSingleDialog('category', 'delete');
    setIsDeleteCategoryOpen(value);
  }, [ensureSingleDialog]);
  
  const safeSetIsAddItemOpen = useCallback((value: boolean) => {
    if (value) ensureSingleDialog('item', 'add');
    setIsAddItemOpen(value);
  }, [ensureSingleDialog]);
  
  const safeSetIsEditItemOpen = useCallback((value: boolean) => {
    if (value) ensureSingleDialog('item', 'edit');
    setIsEditItemOpen(value);
  }, [ensureSingleDialog]);
  
  const safeSetIsDeleteItemOpen = useCallback((value: boolean) => {
    if (value) ensureSingleDialog('item', 'delete');
    setIsDeleteItemOpen(value);
  }, [ensureSingleDialog]);
  
  return {
    // Category dialog states
    isAddCategoryOpen,
    setIsAddCategoryOpen: safeSetIsAddCategoryOpen,
    isEditCategoryOpen,
    setIsEditCategoryOpen: safeSetIsEditCategoryOpen,
    isDeleteCategoryOpen,
    setIsDeleteCategoryOpen: safeSetIsDeleteCategoryOpen,
    selectedCategory,
    setSelectedCategory,
    
    // Item dialog states
    isAddItemOpen,
    setIsAddItemOpen: safeSetIsAddItemOpen,
    isEditItemOpen,
    setIsEditItemOpen: safeSetIsEditItemOpen,
    isDeleteItemOpen,
    setIsDeleteItemOpen: safeSetIsDeleteItemOpen,
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
