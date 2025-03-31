
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMenuItems } from '@/services/menuService';
import { MenuItem } from '@/types/menu';
import { TEST_MENU_ITEMS } from './test-data';
import { toast } from '@/hooks/use-toast';

export const useItemQueries = (
  restaurantId: string,
  usingTestData: boolean,
  setUsingTestData: (value: boolean) => void
) => {
  const queryClient = useQueryClient();
  
  // Fetch menu items
  const { 
    data: menuItemsData = [], 
    isLoading: isItemsLoading, 
    error: itemsError,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: () => fetchMenuItems(undefined, restaurantId),
    retry: 3,
    staleTime: 5000, // 5 seconds
    meta: {
      errorHandler: true
    }
  });
  
  // Use test data if there are errors with real data or if explicitly requested
  const menuItems = (itemsError || (menuItemsData.length === 0 && usingTestData)) 
    ? TEST_MENU_ITEMS 
    : menuItemsData;

  // Auto-retry if there's an error fetching items
  useEffect(() => {
    if (itemsError) {
      console.error("Error fetching items:", itemsError);
      
      // Determine the specific error type for better user guidance
      let errorTitle = "Could not load menu items";
      let errorDescription = "Falling back to test data";
      
      if (itemsError instanceof Error) {
        const errorMsg = itemsError.message.toLowerCase();
        
        if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          errorTitle = "Network connection issue";
          errorDescription = "Check your internet connection and try again. Using test data for now.";
        } else if (errorMsg.includes('timeout')) {
          errorTitle = "Server response timeout";
          errorDescription = "The server is taking too long to respond. Using test data for now.";
        } else if (errorMsg.includes('permission') || errorMsg.includes('security policy')) {
          errorTitle = "Permission error";
          errorDescription = "You may not have permission to view this data. Using test data instead.";
        }
      }
      
      // Show error toast with specific guidance
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
      
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

  useEffect(() => {
    // Log the items when they change to help with debugging
    console.log("Current menu items:", menuItems);
  }, [menuItems]);

  // Manually invalidate the query cache when needed
  const invalidateItemsCache = () => {
    queryClient.invalidateQueries({ queryKey: ['menuItems'] });
  };

  return {
    menuItems,
    isItemsLoading,
    itemsError,
    refetchItems,
    invalidateItemsCache
  };
};
