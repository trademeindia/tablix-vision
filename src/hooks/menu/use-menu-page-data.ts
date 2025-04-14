
import { useState } from 'react';
import { MenuItem } from '@/types/menu';
import { useCategoryQueries } from './use-category-queries';
import { useItemQueries } from './use-item-queries';
import { useDialogStates } from './use-dialog-states';
import { useRealtimeMenu } from './use-realtime-menu';

export const useMenuPageData = (restaurantId: string) => {
  const [activeTab, setActiveTab] = useState('items');
  const [usingTestData, setUsingTestData] = useState(false);
  
  // Set up real-time subscriptions if not using test data
  const { menuItems: realtimeItems } = useRealtimeMenu(
    !usingTestData ? restaurantId : undefined
  );
  
  // Use the category queries hook
  const {
    categories,
    isCategoriesLoading,
    categoriesError,
    handleRefreshCategories,
  } = useCategoryQueries(restaurantId, usingTestData, setUsingTestData);
  
  // Use the item queries hook
  const {
    menuItems,
    isItemsLoading,
    itemsError,
  } = useItemQueries(restaurantId, usingTestData, setUsingTestData);
  
  // Merge realtime items with query items if available
  const finalMenuItems = !usingTestData && realtimeItems.length > 0 
    ? realtimeItems 
    : menuItems;
  
  // Use the dialog states hook
  const {
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
    
    handleEditCategory,
    handleDeleteCategoryClick,
    handleEditItem,
    handleDeleteItemClick,
    handleViewItem: baseHandleViewItem,
  } = useDialogStates();
  
  // Create a wrapped handler for viewing items that doesn't need menuItems as a param
  const handleViewItem = (id: string) => baseHandleViewItem(id, finalMenuItems);

  return {
    // Tab state
    activeTab,
    setActiveTab,
    
    // Data and loading states
    categories,
    menuItems: finalMenuItems,
    isCategoriesLoading,
    isItemsLoading,
    categoriesError,
    itemsError,
    
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
    
    // Functions
    handleRefreshCategories,
    handleEditCategory,
    handleDeleteCategoryClick,
    handleEditItem,
    handleDeleteItemClick,
    handleViewItem,
    
    // Test data status
    usingTestData
  };
};
