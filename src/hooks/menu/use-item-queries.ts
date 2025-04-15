
import { useState, useEffect, useRef } from 'react';
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
  const periodicRefreshRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef(true);
  
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
        console.log("Fetched items count:", items.length);
        return items;
      } catch (error) {
        console.error("Error in fetchMenuItems:", error);
        throw error;
      }
    },
    retry: 3,
    staleTime: 60000, // 60 seconds - increased to reduce refreshes
    gcTime: 5 * 60 * 1000, // 5 minutes cache duration
    enabled: !usingTestData && !!restaurantId, // Only run query if not using test data
  });
  
  // Use test data as the primary source for demonstration
  const menuItems: MenuItem[] = usingTestData
    ? TEST_MENU_ITEMS 
    : menuItemsData;

  useEffect(() => {
    // Log the items when they change to help with debugging
    if (!isFirstRun.current || menuItems.length > 0) {
      console.log("Current menu items count:", menuItems.length);
      isFirstRun.current = false;
    }
  }, [menuItems]);

  // Manually invalidate the query cache when needed
  const invalidateItemsCache = () => {
    console.log("Manually invalidating items cache");
    queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] });
  };
  
  // Set up a periodic refresh to ensure data stays updated, but with a longer interval
  useEffect(() => {
    // Clear any existing interval first
    if (periodicRefreshRef.current) {
      clearInterval(periodicRefreshRef.current);
      periodicRefreshRef.current = null;
    }
    
    if (!usingTestData && restaurantId) {
      periodicRefreshRef.current = setInterval(() => {
        console.log("Periodic refresh of menu items");
        invalidateItemsCache();
      }, 120000); // Refresh every 120 seconds (2 minutes) to reduce refreshes
    }
    
    return () => {
      if (periodicRefreshRef.current) {
        clearInterval(periodicRefreshRef.current);
        periodicRefreshRef.current = null;
      }
    };
  }, [usingTestData, restaurantId, queryClient]);

  return {
    menuItems,
    isItemsLoading,
    itemsError,
    refetchItems,
    invalidateItemsCache
  };
};
