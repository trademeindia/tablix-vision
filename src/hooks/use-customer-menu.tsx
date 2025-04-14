
import { useState, useEffect, useCallback } from 'react';
import { useMenuDataWithRealtime } from '@/hooks/menu/use-menu-data-with-realtime';
import { useQRCode } from '@/hooks/use-qr-code';
import { useQRDataParser } from '@/hooks/use-qr-data-parser';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateTestMenuData } from '@/services/menu';
import { toast } from '@/hooks/use-toast';

export function useCustomerMenu() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for tracking if we're using test data
  const [usingTestData, setUsingTestData] = useState(true);
  const [testData, setTestData] = useState<{ categories: any[], items: any[] } | null>(null);
  const [toastShown, setToastShown] = useState(false);
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState<{
    scannedQrData: string | null;
    parsedTableId: string | null;
    parsedRestaurantId: string | null;
    locationSearch: string;
    locationPathname: string;
  }>({
    scannedQrData: null,
    parsedTableId: null,
    parsedRestaurantId: null,
    locationSearch: location.search,
    locationPathname: location.pathname,
  });
  
  // QR code scanning hooks
  const { isScanning, startScanning, handleScan } = useQRCode();
  
  // QR data parsing hook
  const { tableId, restaurantId, parseQRData } = useQRDataParser();
  
  // Update debug info when data changes
  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      parsedTableId: tableId,
      parsedRestaurantId: restaurantId,
      locationSearch: location.search,
      locationPathname: location.pathname,
    }));
  }, [tableId, restaurantId, location.search, location.pathname]);
  
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
    setDebugInfo(prev => ({
      ...prev,
      scannedQrData: data
    }));
    
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
  }, [parseQRData, handleScan, queryClient]);
  
  // Use the realtime menu data hook for better performance
  const { categories, items, isLoading, error, refetchCategories } = useMenuDataWithRealtime(restaurantId);
  
  // Check if toast has been shown before in this session
  const hasToastBeenShown = () => {
    return localStorage.getItem('customerMenuToastShown') === 'true';
  };
  
  // Generate and use test data
  useEffect(() => {
    // Always generate test data for demonstration
    if (restaurantId && !testData) {
      const data = generateTestMenuData(restaurantId);
      setTestData(data);
      setUsingTestData(true);
      
      // Update react-query cache with test data
      queryClient.setQueryData(['menuCategories', restaurantId], data.categories);
      queryClient.setQueryData(['menuItems', restaurantId], data.items);
      
      // Only show toast if it hasn't been shown yet
      if (!toastShown && !hasToastBeenShown()) {
        toast({
          title: "Demo Mode",
          description: "You're viewing a demonstration with sample menu items.",
        });
        setToastShown(true);
        localStorage.setItem('customerMenuToastShown', 'true');
      }
    }
  }, [restaurantId, testData, queryClient, toastShown]);
  
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
  
  // Determine if we should show debug info
  const showDebugInfo = process.env.NODE_ENV === 'development' || new URLSearchParams(location.search).has('debug');
  
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
