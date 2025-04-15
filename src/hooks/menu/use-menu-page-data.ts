
import { useState, useEffect } from 'react';
import { MenuItem } from '@/types/menu';
import { useCategoryQueries } from './use-category-queries';
import { useItemQueries } from './use-item-queries';
import { useDialogStates } from './use-dialog-states';
import { useRealtimeMenu } from './use-realtime-menu';
import { toast } from '@/hooks/use-toast';

export const useMenuPageData = (restaurantId: string) => {
  const [activeTab, setActiveTab] = useState('items');
  const [usingTestData, setUsingTestData] = useState(false);
  
  // Set up real-time subscriptions if not using test data
  const { menuItems: realtimeItems, isLoading: isRealtimeLoading } = useRealtimeMenu(
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
    menuItems: queryMenuItems,
    isItemsLoading,
    itemsError,
    refetchItems,
  } = useItemQueries(restaurantId, usingTestData, setUsingTestData);
  
  // Merge realtime items with query items if available
  const [mergedMenuItems, setMergedMenuItems] = useState<MenuItem[]>(queryMenuItems);

  useEffect(() => {
    if (!usingTestData) {
      if (realtimeItems.length > 0) {
        // Merge realtime updates into queryMenuItems
        const updatedItems = queryMenuItems.map(item => {
          const realtimeItem = realtimeItems.find(rItem => rItem.id === item.id);
          return realtimeItem ? realtimeItem : item;
        });

        // Add any new items from realtimeItems that are not in queryMenuItems
        const newItems = realtimeItems.filter(rItem => !queryMenuItems.find(item => item.id === rItem.id));

        setMergedMenuItems([...updatedItems, ...newItems]);
      } else {
        setMergedMenuItems(queryMenuItems);
      }
    } else {
      setMergedMenuItems(queryMenuItems);
    }
  }, [realtimeItems, queryMenuItems, usingTestData]);

  const menuItems = mergedMenuItems;
  
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
  const handleViewItem = (id: string) => baseHandleViewItem(id, menuItems);

  // Log when menu items change for debugging
  useEffect(() => {
    console.log("Menu items updated in useMenuPageData:", menuItems?.length || 0);
    
    if (menuItems?.length === 0 && !isItemsLoading && !isCategoriesLoading && !isRealtimeLoading && !usingTestData) {
      // If we have no items and we're not loading, try to refetch once
      console.log("No menu items found, triggering refetch");
      const timer = setTimeout(() => {
        refetchItems();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [menuItems, isItemsLoading, isCategoriesLoading, isRealtimeLoading, refetchItems, usingTestData]);

  // Auto-switch to test data if there are API errors
  useEffect(() => {
    if ((categoriesError || itemsError) && !usingTestData) {
      console.log("Errors detected, switching to test data");
      setUsingTestData(true);
      toast({
        title: "Using test data",
        description: "There was an error fetching data from the server, using test data instead",
      });
    }
  }, [categoriesError, itemsError, usingTestData, setUsingTestData]);

  return {
    // Tab state
    activeTab,
    setActiveTab,
    
    // Data and loading states
    categories,
    menuItems,
    isCategoriesLoading: isCategoriesLoading || isRealtimeLoading,
    isItemsLoading: isItemsLoading || isRealtimeLoading,
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
