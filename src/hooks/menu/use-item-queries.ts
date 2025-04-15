
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
    gcTime: 5 * 60 * 1000, // 5 minutes cache duration (replaces deprecated cacheTime)
    enabled: !usingTestData && !!restaurantId, // Only run query if not using test data
  });
  
  // Use test data as the primary source for demonstration
  const menuItems: MenuItem[] = usingTestData
    ? TEST_MENU_ITEMS 
    : menuItemsData;

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
    }, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(interval);
  }, [usingTestData, restaurantId, queryClient]);

  return {
    menuItems,
    isItemsLoading,
    itemsError,
    refetchItems,
    invalidateItemsCache
  };
};
