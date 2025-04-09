
import { useState, useEffect, useCallback } from 'react';
import { useMenuData } from '@/hooks/use-menu-data';
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
  
  // State for tracking if we're using test data - default to true for demonstration
  const [usingTestData, setUsingTestData] = useState(true);
  const [testData, setTestData] = useState<{ categories: any[], items: any[] } | null>(null);
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState<{
    scannedQrData: string | null;
    parsedTableId: string | null;
    parsedRestaurantId: string | null;
    locationSearch: string;
    locationPathname: string;
    hasTestData: boolean;
  }>({
    scannedQrData: null,
    parsedTableId: null,
    parsedRestaurantId: null,
    locationSearch: location.search,
    locationPathname: location.pathname,
    hasTestData: false
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
      hasTestData: testData !== null
    }));
  }, [tableId, restaurantId, location.search, location.pathname, testData]);
  
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
        // Generate test data immediately to ensure consistent data
        const generatedTestData = generateTestMenuData(resId);
        setTestData(generatedTestData);
        
        // Prefetch menu data once we have a restaurant ID
        queryClient.setQueryData(['menuCategories', resId], generatedTestData.categories);
        queryClient.setQueryData(['menuItems', resId], generatedTestData.items);
      }
    } catch (error) {
      console.error("Error parsing QR URL:", error);
    }
  }, [parseQRData, handleScan, queryClient]);
  
  // Fetch menu data using the hook
  const { categories, items, isLoading, error, refetchCategories } = useMenuData(restaurantId);
  
  // Generate and use test data immediately when restaurant ID is available
  useEffect(() => {
    if (restaurantId && (!testData || testData.categories[0].restaurant_id !== restaurantId)) {
      console.log("Generating fresh test data for restaurant:", restaurantId);
      const generatedData = generateTestMenuData(restaurantId);
      setTestData(generatedData);
      setUsingTestData(true);
      
      // Update react-query cache with test data
      queryClient.setQueryData(['menuCategories', restaurantId], generatedData.categories);
      queryClient.setQueryData(['menuItems', restaurantId], generatedData.items);
      
      toast({
        title: "Sample Menu Data",
        description: "You're viewing a demonstration with GIFs and 3D model examples. Check the 'Showcase Items' category!",
      });
    }
  }, [restaurantId, testData, queryClient]);
  
  // Attempt to refetch data automatically if there's an error
  useEffect(() => {
    if (error && restaurantId) {
      console.error("Error fetching menu data:", error);
      toast({
        title: "Using sample menu",
        description: "Check out the 'Showcase Items' category for interactive examples!",
        variant: "default",
      });
      
      // Ensure we're using test data if there was an error
      if (!usingTestData) {
        setUsingTestData(true);
        const generatedData = generateTestMenuData(restaurantId);
        setTestData(generatedData);
        
        // Update cache
        queryClient.setQueryData(['menuCategories', restaurantId], generatedData.categories);
        queryClient.setQueryData(['menuItems', restaurantId], generatedData.items);
      }
    }
  }, [error, restaurantId, usingTestData, queryClient]);
  
  // Manually rescan QR code
  const handleRescan = useCallback(() => {
    localStorage.removeItem('tableId');
    localStorage.removeItem('restaurantId');
    setTestData(null);
    startScanning();
  }, [startScanning]);
  
  // Determine if we should show debug info
  const showDebugInfo = process.env.NODE_ENV === 'development' || new URLSearchParams(location.search).has('debug');
  
  // Use test data for demonstration purposes
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
