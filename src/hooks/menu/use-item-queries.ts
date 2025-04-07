
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMenuItems } from '@/services/menu';
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
        console.log("Fetching menu items for restaurant:", restaurantId);
        const items = await fetchMenuItems(undefined, restaurantId);
        console.log("Fetched items:", items);
        return items;
      } catch (error) {
        console.error("Error in fetchMenuItems:", error);
        throw error;
      }
    },
    retry: 3,
    staleTime: 1000, // 1 second - shorter stale time to refresh more frequently
  });
  
  // Use test data if there are errors with real data or if explicitly requested
  const menuItems: MenuItem[] = (itemsError || (menuItemsData.length === 0 && usingTestData)) 
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
      }, 1000);
      
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
    console.log("Manually invalidating items cache");
    queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] });
  };
  
  // Set up a periodic refresh to ensure data stays updated
  useEffect(() => {
    const interval = setInterval(() => {
      if (!usingTestData) {
        console.log("Periodic refresh of menu items");
        invalidateItemsCache();
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [usingTestData, restaurantId]);

  return {
    menuItems,
    isItemsLoading,
    itemsError,
    refetchItems,
    invalidateItemsCache
  };
};
