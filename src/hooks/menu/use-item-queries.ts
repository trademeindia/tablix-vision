
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuItems } from '@/services/menuService';
import { MenuItem } from '@/types/menu';
import { TEST_MENU_ITEMS } from './test-data';

export const useItemQueries = (
  restaurantId: string,
  usingTestData: boolean,
  setUsingTestData: (value: boolean) => void
) => {
  // Fetch menu items
  const { 
    data: menuItemsData = [], 
    isLoading: isItemsLoading, 
    error: itemsError,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => fetchMenuItems(undefined, restaurantId),
    retry: 2,
    staleTime: 30000 // 30 seconds
  });
  
  // Use test data if there are errors with real data
  const menuItems = (itemsError || menuItemsData.length === 0) && usingTestData 
    ? TEST_MENU_ITEMS 
    : menuItemsData;

  // Auto-retry if there's an error fetching items
  useEffect(() => {
    if (itemsError) {
      console.error("Error fetching items:", itemsError);
      // Use test data after multiple retries
      setTimeout(() => {
        setUsingTestData(true);
      }, 5000);
      
      const timer = setTimeout(() => {
        refetchItems();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [itemsError, refetchItems, setUsingTestData]);

  return {
    menuItems,
    isItemsLoading,
    itemsError,
    refetchItems
  };
};
