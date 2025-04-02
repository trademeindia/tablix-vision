
import React from 'react';
import { useOrderItems } from '@/hooks/use-order-items';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import QRScannerSection from '@/components/customer/menu/QRScannerSection';
import LoadingErrorSection from '@/components/customer/menu/LoadingErrorSection';
import MenuContent from '@/components/customer/menu/MenuContent';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';
import { useCustomerMenu } from '@/hooks/use-customer-menu';
import DebugPanel from '@/components/customer/menu/DebugPanel';
import NoMenuView from '@/components/customer/menu/NoMenuView';
import TestDataAlert from '@/components/customer/menu/TestDataAlert';

const CustomerMenuPage = () => {
  // Order management hook
  const { 
    orderItems, 
    addToOrder, 
    removeFromOrder, 
    totalItems,
  } = useOrderItems();
  
  // Customer menu hook for QR and menu data management
  const {
    isScanning,
    handleQRScan,
    tableId,
    restaurantId,
    categories,
    items,
    isLoading,
    error,
    refetchCategories,
    usingTestData,
    hasMenuData,
    debugInfo,
    showDebugInfo,
    handleRescan
  } = useCustomerMenu();
  
  // If no restaurant/table data, show QR scanner
  if (!restaurantId || !tableId) {
    return (
      <PageTransition>
        <QRScannerSection 
          isScanning={isScanning}
          startScanning={isScanning}
          handleScan={handleQRScan}
        />
        
        {showDebugInfo && (
          <div className="p-4 mt-4 border rounded-lg max-w-md mx-auto">
            <h3 className="font-medium mb-2">Debug Info</h3>
            <pre className="text-xs whitespace-pre-wrap bg-gray-100 p-2 rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </PageTransition>
    );
  }
  
  // Display loading/error states
  if (isLoading) {
    return (
      <PageTransition>
        <LoadingErrorSection 
          isLoading={true} 
          error={null} 
          onRetry={() => refetchCategories()}
        />
        
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={handleRescan}>
            <Scan className="h-4 w-4 mr-2" />
            Scan Different QR Code
          </Button>
        </div>
        
        {showDebugInfo && (
          <div className="p-4 mt-4 border rounded-lg max-w-md mx-auto">
            <h3 className="font-medium mb-2">Debug Info</h3>
            <pre className="text-xs whitespace-pre-wrap bg-gray-100 p-2 rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </PageTransition>
    );
  }
  
  // If no menu data was found despite successful loading
  if (!hasMenuData) {
    return (
      <PageTransition>
        <CustomerMenuLayout 
          tableId={tableId} 
          restaurantId={restaurantId}
          orderItemsCount={totalItems}
        >
          <NoMenuView 
            restaurantId={restaurantId} 
            onRescan={handleRescan} 
          />
          
          {showDebugInfo && (
            <div className="p-4 mt-4 border rounded-lg">
              <h3 className="font-medium mb-2">Debug Info</h3>
              <pre className="text-xs whitespace-pre-wrap bg-gray-100 p-2 rounded">
                {JSON.stringify({
                  ...debugInfo,
                  usingTestData,
                  categoriesCount: categories?.length || 0,
                  itemsCount: items?.length || 0
                }, null, 2)}
              </pre>
            </div>
          )}
        </CustomerMenuLayout>
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
        
        <TestDataAlert isVisible={usingTestData} />
        
        {showDebugInfo && (
          <DebugPanel 
            debugInfo={{
              ...debugInfo,
              usingTestData,
              categoriesCount: categories?.length || 0,
              itemsCount: items?.length || 0,
              orderItemsCount: orderItems?.length || 0
            }} 
          />
        )}
      </CustomerMenuLayout>
    </PageTransition>
  );
};

export default CustomerMenuPage;
