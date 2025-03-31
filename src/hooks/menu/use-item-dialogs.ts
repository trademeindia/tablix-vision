
import { useState } from 'react';
import { MenuItem } from '@/types/menu';

export const useItemDialogs = () => {
  // Item dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  return {
    // Dialog states
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedItem,
    setSelectedItem,
    
    // Helper functions for common actions
    handleAddItem: () => {
      setIsAddOpen(true);
    },
    
    handleEditItem: (item: MenuItem) => {
      setSelectedItem(item);
      setIsEditOpen(true);
    },
    
    handleDeleteItem: (item: MenuItem) => {
      setSelectedItem(item);
      setIsDeleteOpen(true);
    },
    
    handleViewItem: (id: string, items: MenuItem[]) => {
      const item = items.find(item => item.id === id);
      if (item) {
        setSelectedItem(item);
        setIsEditOpen(true);
      }
    },
    
    resetDialogs: () => {
      setIsAddOpen(false);
      setIsEditOpen(false);
      setIsDeleteOpen(false);
      setSelectedItem(null);
    }
  };
};
