
import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshMenuData = (
  restaurantId: string,
  handleRefreshCategories: () => Promise<void>
) => {
  const queryClient = useQueryClient();
  const isRefreshing = useRef(false);

  // Enhanced refresh function that ensures both categories and items are refreshed
  const handleRefreshAll = useCallback(async () => {
    // Prevent multiple simultaneous refreshes
    if (isRefreshing.current) {
      console.log("Already refreshing, skip this refresh request");
      return;
    }
    
    console.log("Refreshing all menu data");
    isRefreshing.current = true;
    
    try {
      // Force refetch of both categories and items
      await Promise.all([
        handleRefreshCategories(),
        queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] })
      ]);
      
      // Manual refetch after a longer delay to prevent rapid refreshes
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['menuItems', restaurantId] });
        isRefreshing.current = false;
        console.log("Data refresh complete");
      }, 1000); // Increased from 500ms to 1000ms to reduce flicker
    } catch (error) {
      console.error("Error refreshing data:", error);
      isRefreshing.current = false;
    }
  }, [handleRefreshCategories, queryClient, restaurantId]);

  return {
    handleRefreshAll,
    isRefreshing
  };
};
