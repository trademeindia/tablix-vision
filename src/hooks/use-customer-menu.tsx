
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMenuDataWithRealtime } from '@/hooks/menu/use-menu-data-with-realtime';
import { useQRCode } from '@/hooks/use-qr-code';
import { useQRDataParser } from '@/hooks/use-qr-data-parser';
import { useMenuTestData } from '@/hooks/menu/use-menu-test-data';
import { useMenuUrlParams } from '@/hooks/menu/use-menu-url-params';
import { useMenuErrorHandler } from '@/hooks/menu/use-menu-error-handler';
import { useMenuQRScanner } from '@/hooks/menu/use-menu-qr-scanner';
import { useDebugInfo } from '@/hooks/use-debug-info';
import { toast } from '@/hooks/use-toast';

export function useCustomerMenu() {
  const queryClient = useQueryClient();
  const location = useLocation();
  
  // QR code scanning hooks
  const { isScanning, startScanning, handleScan } = useQRCode();
  const { tableId, restaurantId, parseQRData } = useQRDataParser();
  const { handleQRScan } = useMenuQRScanner(parseQRData, handleScan);
  
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
  
  // Use debug info hook
  const { debugInfo, showDebugInfo } = useDebugInfo(tableId, restaurantId);
  
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
    debugInfo,
    handleRescan,
  };
}
