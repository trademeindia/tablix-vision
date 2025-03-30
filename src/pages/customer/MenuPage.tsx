
import React, { useCallback } from 'react';
import { useQRCode } from '@/hooks/use-qr-code';
import { useQRDataParser } from '@/hooks/use-qr-data-parser';
import { useOrderItems } from '@/hooks/use-order-items';
import { useMenuData } from '@/hooks/use-menu-data';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import QRScannerSection from '@/components/customer/menu/QRScannerSection';
import LoadingErrorSection from '@/components/customer/menu/LoadingErrorSection';
import MenuContent from '@/components/customer/menu/MenuContent';
import PageTransition from '@/components/ui/page-transition';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

const CustomerMenuPage = () => {
  const queryClient = useQueryClient();
  
  // QR code scanning hooks
  const { isScanning, startScanning, handleScan } = useQRCode();
  
  // QR data parsing hook
  const { tableId, restaurantId, parseQRData } = useQRDataParser();
  
  // Order management hook
  const { orderItems, addToOrder, removeFromOrder, totalItems } = useOrderItems();
  
  // Handle QR scan success
  const handleQRScan = useCallback((data: string) => {
    parseQRData(data);
    handleScan(data);
    
    // Extract restaurant ID from QR data to prefetch menu data
    const params = new URLSearchParams(data.split('?')[1]);
    const resId = params.get('restaurant');
    
    if (resId) {
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
  }, [parseQRData, handleScan, queryClient]);
  
  // Fetch menu data using the hook
  const { categories, items, isLoading, error } = useMenuData(restaurantId);
  
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
        <LoadingErrorSection isLoading={isLoading} error={error} />
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
