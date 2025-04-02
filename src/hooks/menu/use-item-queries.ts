
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
  
  // Fetch menu items with proper type definitions
  const { 
    data: menuItemsData = [], 
    isLoading: isItemsLoading, 
    error: itemsError,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      try {
        // For demo purposes, if restaurantId contains 'demo', use test data
        if (restaurantId && restaurantId.includes('demo')) {
          console.log('Using test data for demo restaurant');
          setUsingTestData(true);
          return TEST_MENU_ITEMS;
        }
        
        const items = await fetchMenuItems(undefined, restaurantId);
        
        // If no items are returned, use test data
        if (!items || items.length === 0) {
          console.log('No items found, using test data');
          setUsingTestData(true);
          return TEST_MENU_ITEMS;
        }
        
        console.log(`Fetched ${items.length} menu items for restaurant ${restaurantId}`);
        return items;
      } catch (error) {
        console.error("Error in fetchMenuItems:", error);
        setUsingTestData(true);
        throw error;
      }
    },
    retry: 3,
    staleTime: 5000, // 5 seconds
  });
  
  // Always fall back to test data if there are errors or no data
  const menuItems: MenuItem[] = (itemsError || (menuItemsData.length === 0)) 
    ? TEST_MENU_ITEMS 
    : menuItemsData;

  // Auto-retry if there's an error fetching items
  useEffect(() => {
    if (itemsError) {
      console.error("Error fetching items:", itemsError);
      
      // Determine the specific error type for better user guidance
      let errorTitle = "Using sample menu data";
      let errorDescription = "For demonstration purposes";
      
      if (itemsError instanceof Error) {
        const errorMsg = itemsError.message.toLowerCase();
        
        if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          errorTitle = "Using sample menu data";
          errorDescription = "Network connectivity issue detected";
        } else if (errorMsg.includes('timeout')) {
          errorTitle = "Using sample menu data";
          errorDescription = "Server response timeout";
        } else if (errorMsg.includes('permission') || errorMsg.includes('security policy')) {
          errorTitle = "Using sample menu data";
          errorDescription = "Permission settings configured for demo mode";
        }
      }
      
      // Show toast with friendly message
      toast({
        title: errorTitle,
        description: errorDescription,
      });
      
      // Always use test data after errors
      setUsingTestData(true);
    }
  }, [itemsError, setUsingTestData]);

  // Debug log for items
  useEffect(() => {
    console.log("Current menu items:", menuItems?.length || 0, "items available");
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
