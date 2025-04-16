
import { useState, useCallback } from 'react';
import { useMenuDataWithRealtime } from '@/hooks/menu/use-menu-data-with-realtime';
import { useQRCode } from '@/hooks/use-qr-code';
import { useQRDataParser } from '@/hooks/use-qr-data-parser';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useMenuTestData } from '@/hooks/menu/use-menu-test-data';
import { useMenuUrlParams } from '@/hooks/menu/use-menu-url-params';
import { useMenuErrorHandler } from '@/hooks/menu/use-menu-error-handler';
import { toast } from '@/hooks/use-toast';

export function useCustomerMenu() {
  const queryClient = useQueryClient();
  const location = useLocation();
  
  const { isScanning, startScanning, handleScan } = useQRCode();
  const { tableId, restaurantId, parseQRData } = useQRDataParser();
  
  // Use the realtime menu data hook
  const { categories, items, isLoading, error } = useMenuDataWithRealtime(restaurantId);
  
  // Method to manually refresh data
  const refetchCategories = useCallback(async () => {
    if (restaurantId) {
      queryClient.invalidateQueries({ queryKey: ['menuCategories', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] });
      toast({
        title: "Refreshing menu",
        description: "Getting the latest menu items...",
      });
    }
  }, [restaurantId, queryClient]);
  
  // Use the test data hook
  const { usingTestData, testData, generateAndUseTestData } = useMenuTestData(restaurantId);
  
  // Use URL parameters hook
  useMenuUrlParams(parseQRData);
  
  // Use error handler hook
  useMenuErrorHandler(error, restaurantId, refetchCategories);
  
  // Handle QR scan success
  const handleQRScan = useCallback((data: string) => {
    parseQRData(data);
    handleScan(data);
    
    try {
      const url = new URL(data);
      const params = new URLSearchParams(url.search);
      const resId = params.get('restaurant');
      
      if (resId) {
        console.log("Prefetching menu data for restaurant:", resId);
        queryClient.prefetchQuery({
          queryKey: ['menuCategories', resId],
          queryFn: () => Promise.resolve([]),
        });
        queryClient.prefetchQuery({
          queryKey: ['menuItems', resId],
          queryFn: () => Promise.resolve([]),
        });
      }
    } catch (error) {
      console.error("Error parsing QR URL:", error);
    }
  }, [parseQRData, handleScan, queryClient]);
  
  // Handle manual rescan
  const handleRescan = useCallback(() => {
    localStorage.removeItem('tableId');
    localStorage.removeItem('restaurantId');
    startScanning();
  }, [startScanning]);
  
  // Generate test data if needed
  useEffect(() => {
    generateAndUseTestData();
  }, [generateAndUseTestData]);
  
  // Determine if we should show debug info
  const showDebugInfo = import.meta.env.DEV || new URLSearchParams(location.search).has('debug');
  
  // Use test data if available
  const finalCategories = usingTestData && testData ? testData.categories : categories;
  const finalItems = usingTestData && testData ? testData.items : items;
  
  // Check if we have any categories or items
  const hasMenuData = (finalCategories && finalCategories.length > 0) && (finalItems && finalItems.length > 0);
  
  return {
    isScanning,
    startScanning,
    handleQRScan,
    tableId,
    restaurantId,
    categories: finalCategories,
    items: finalItems,
    isLoading,
    error,
    refetchCategories,
    usingTestData,
    hasMenuData,
    showDebugInfo,
    handleRescan,
  };
}
