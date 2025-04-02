
import React, { useCallback, useEffect } from 'react';
import { useQRCode } from '@/hooks/use-qr-code';
import { useQRDataParser } from '@/hooks/use-qr-data-parser';
import { useOrderItems } from '@/hooks/use-order-items';
import { useMenuData } from '@/hooks/use-menu-data';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import QRScannerSection from '@/components/customer/menu/QRScannerSection';
import LoadingErrorSection from '@/components/customer/menu/LoadingErrorSection';
import MenuContent from '@/components/customer/menu/MenuContent';
import PageTransition from '@/components/ui/page-transition';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const CustomerMenuPage = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  
  // QR code scanning hooks
  const { isScanning, startScanning, handleScan } = useQRCode();
  
  // QR data parsing hook
  const { tableId, restaurantId, parseQRData } = useQRDataParser();
  
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
  }, [location, parseQRData]);
  
  // Order management hook with enhanced functionality
  const { 
    orderItems, 
    addToOrder, 
    removeFromOrder, 
    totalItems,
    totalPrice 
  } = useOrderItems();
  
  // Handle QR scan success
  const handleQRScan = useCallback((data: string) => {
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
  
  // Fetch menu data using the hook
  const { categories, items, isLoading, error, refetchCategories } = useMenuData(restaurantId);
  
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
  
  // If no restaurant/table data, show QR scanner
  if (!restaurantId || !tableId) {
    return (
      <PageTransition>
        <QRScannerSection 
          isScanning={isScanning}
          startScanning={startScanning}
          handleScan={handleQRScan}
        />
      </PageTransition>
    );
  }
  
  // Display loading/error states
  if (isLoading || error) {
    return (
      <PageTransition>
        <LoadingErrorSection 
          isLoading={isLoading} 
          error={error} 
          onRetry={() => refetchCategories()}
        />
      </PageTransition>
    );
  }
  
  // Main content with menu
  return (
    <PageTransition>
      <CustomerMenuLayout 
        tableId={tableId} 
        restaurantId={restaurantId}
        orderItemsCount={totalItems}
      >
        <MenuContent 
          categories={categories || []}
          items={items}
          tableId={tableId}
          restaurantId={restaurantId}
          orderItems={orderItems}
          onRemoveFromOrder={removeFromOrder}
          onAddToOrder={addToOrder}
        />
      </CustomerMenuLayout>
    </PageTransition>
  );
};

export default CustomerMenuPage;
