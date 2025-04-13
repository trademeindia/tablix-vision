
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMenuData } from '@/hooks/use-menu-data';
import { useQRCode } from '@/hooks/use-qr-code';
import { useQRDataParser } from '@/hooks/use-qr-data-parser';
import { useTestData } from '@/hooks/use-test-data';
import { useDebugInfo } from '@/hooks/use-debug-info';
import { toast } from '@/hooks/use-toast';

export function useCustomerMenu() {
  const queryClient = useQueryClient();
  const location = useLocation();
  
  // QR code scanning hooks
  const { isScanning, startScanning, handleScan } = useQRCode();
  
  // QR data parsing hook
  const { tableId, restaurantId, parseQRData } = useQRDataParser();
  
  // Debug information hook
  const { debugInfo, updateScannedQrData, showDebugInfo } = useDebugInfo(tableId, restaurantId);
  
  // Test data hook - this already handles the toast notification
  const { usingTestData, setUsingTestData, testData } = useTestData(restaurantId);
  
  // Parse URL parameters on load
  useEffect(() => {
    // Check if we have parameters in the URL
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    const restaurantParam = params.get('restaurant');
    
    if (tableParam && restaurantParam) {
      console.log("Found params in URL:", { table: tableParam, restaurant: restaurantParam });
      // Using the full URL with search parameters to ensure proper parsing
      parseQRData(window.location.href);
    }
  }, [location.search, parseQRData]);
  
  // Handle QR scan success
  const handleQRScan = useCallback((data: string) => {
    updateScannedQrData(data);
    
    parseQRData(data);
    handleScan(data);
    
    try {
      // Extract restaurant ID from QR data to prefetch menu data
      const url = new URL(data);
      const params = new URLSearchParams(url.search);
      const resId = params.get('restaurant');
      
      if (resId) {
        console.log("Prefetching menu data for restaurant:", resId);
        // Prefetch menu data once we have a restaurant ID
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
  }, [parseQRData, handleScan, queryClient, updateScannedQrData]);
  
  // Fetch menu data using the hook
  const { categories, items, isLoading, error, refetchCategories } = useMenuData(restaurantId);
  
  // Use test data if there's an error or no data
  useEffect(() => {
    // If there's an error or no data, generate test data
    if ((error || (categories.length === 0 && !isLoading)) && restaurantId && !testData) {
      setUsingTestData(true);
    }
  }, [error, categories, restaurantId, isLoading, testData, setUsingTestData]);
  
  // Attempt to refetch data automatically if there's an error
  useEffect(() => {
    if (error && restaurantId) {
      console.error("Error fetching menu data:", error);
      toast({
        title: "Could not load menu",
        description: "Trying again...",
        variant: "destructive",
      });
      
      // Try to refetch after a delay
      const timer = setTimeout(() => {
        refetchCategories();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, refetchCategories, restaurantId]);
  
  // Manually rescan QR code
  const handleRescan = useCallback(() => {
    localStorage.removeItem('tableId');
    localStorage.removeItem('restaurantId');
    startScanning();
  }, [startScanning]);
  
  // We're now using test data if there was an error or no real data
  const finalCategories = usingTestData && testData ? testData.categories : categories;
  const finalItems = usingTestData && testData ? testData.items : items;
  
  // Check if we have any categories or items
  const hasMenuData = (finalCategories && finalCategories.length > 0) && (finalItems && finalItems.length > 0);
  
  return {
    // QR code scanning state
    isScanning,
    startScanning,
    handleQRScan,
    
    // Restaurant and table info
    tableId,
    restaurantId,
    
    // Menu data
    categories: finalCategories,
    items: finalItems,
    isLoading,
    error,
    refetchCategories,
    
    // Test data state
    usingTestData,
    hasMenuData,
    
    // Debug info
    debugInfo,
    showDebugInfo,
    
    // Actions
    handleRescan,
  };
}
