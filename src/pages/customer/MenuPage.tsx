
import React from 'react';
import { useQRCode } from '@/hooks/use-qr-code';
import { useQRDataParser } from '@/hooks/use-qr-data-parser';
import { useOrderItems } from '@/hooks/use-order-items';
import { useMenuData } from '@/hooks/use-menu-data';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import QRScannerSection from '@/components/customer/menu/QRScannerSection';
import LoadingErrorSection from '@/components/customer/menu/LoadingErrorSection';
import MenuContent from '@/components/customer/menu/MenuContent';

const CustomerMenuPage = () => {
  // QR code scanning hooks
  const { isScanning, startScanning, handleScan } = useQRCode();
  
  // QR data parsing hook
  const { tableId, restaurantId, parseQRData } = useQRDataParser();
  
  // Order management hook
  const { orderItems, addToOrder, removeFromOrder, totalItems } = useOrderItems();
  
  // Handle QR scan success
  const handleQRScan = (data: string) => {
    parseQRData(data);
    handleScan(data);
  };
  
  // Fetch menu data using the hook
  const { categories, items, isLoading, error } = useMenuData(restaurantId);
  
  // If no restaurant/table data, show QR scanner
  if (!restaurantId || !tableId) {
    return (
      <QRScannerSection 
        isScanning={isScanning}
        startScanning={startScanning}
        handleScan={handleQRScan}
      />
    );
  }
  
  // Display loading/error states
  const loadingErrorContent = (
    <LoadingErrorSection isLoading={isLoading} error={error} />
  );
  
  if (isLoading || error) {
    return loadingErrorContent;
  }
  
  // Main content with menu
  return (
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
  );
};

export default CustomerMenuPage;
