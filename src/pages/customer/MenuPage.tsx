
import React, { useCallback, useEffect, useState } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateTestMenuData } from '@/services/menuService';

const CustomerMenuPage = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use test data when there's no real data
  const [usingTestData, setUsingTestData] = useState(false);
  
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
  
  // Fetch menu data using the hook
  const { categories, items, isLoading, error, refetchCategories } = useMenuData(restaurantId);
  
  // Use test data if there's an error or no data
  const [testData, setTestData] = useState<{ categories: any[], items: any[] } | null>(null);
  
  useEffect(() => {
    // If there's an error or no data, generate test data
    if ((error || (categories.length === 0 && !isLoading)) && restaurantId && !testData) {
      const data = generateTestMenuData(restaurantId);
      setTestData(data);
      setUsingTestData(true);
      
      // Update react-query cache with test data
      queryClient.setQueryData(['menuCategories', restaurantId], data.categories);
      queryClient.setQueryData(['menuItems', restaurantId], data.items);
      
      toast({
        title: "Using Demo Data",
        description: "We're showing example menu items for demonstration purposes.",
      });
    }
  }, [error, categories, restaurantId, isLoading, testData, queryClient]);
  
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
  const handleRescan = () => {
    localStorage.removeItem('tableId');
    localStorage.removeItem('restaurantId');
    startScanning();
  };
  
  // Show debugging information in development
  const showDebugInfo = process.env.NODE_ENV === 'development' || new URLSearchParams(location.search).has('debug');
  
  // If no restaurant/table data, show QR scanner
  if (!restaurantId || !tableId) {
    return (
      <PageTransition>
        <QRScannerSection 
          isScanning={isScanning}
          startScanning={startScanning}
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
  
  // We're now using test data if there was an error or no real data
  const finalCategories = usingTestData && testData ? testData.categories : categories;
  const finalItems = usingTestData && testData ? testData.items : items;
  
  // Check if we have any categories or items
  const hasMenuData = (finalCategories && finalCategories.length > 0) && (finalItems && finalItems.length > 0);
  
  // If no menu data was found despite successful loading
  if (!hasMenuData) {
    return (
      <PageTransition>
        <CustomerMenuLayout 
          tableId={tableId} 
          restaurantId={restaurantId}
          orderItemsCount={totalItems}
        >
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>No menu items found</AlertTitle>
            <AlertDescription>
              This restaurant hasn't added any menu items yet. We'll show you demo items for testing.
            </AlertDescription>
          </Alert>
          
          <Button 
            variant="default" 
            className="mb-6 w-full"
            onClick={() => {
              const data = generateTestMenuData(restaurantId || '');
              setTestData(data);
              setUsingTestData(true);
              
              // Update react-query cache with test data
              queryClient.setQueryData(['menuCategories', restaurantId], data.categories);
              queryClient.setQueryData(['menuItems', restaurantId], data.items);
              
              toast({
                title: "Using Demo Data",
                description: "Showing example menu items for demonstration purposes.",
              });
            }}
          >
            Load Demo Menu
          </Button>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={handleRescan}>
              <Scan className="h-4 w-4 mr-2" />
              Scan Different QR Code
            </Button>
          </div>
          
          {showDebugInfo && (
            <div className="p-4 mt-4 border rounded-lg">
              <h3 className="font-medium mb-2">Debug Info</h3>
              <pre className="text-xs whitespace-pre-wrap bg-gray-100 p-2 rounded">
                {JSON.stringify({
                  ...debugInfo,
                  usingTestData,
                  categoriesCount: finalCategories?.length || 0,
                  itemsCount: finalItems?.length || 0
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
          categories={finalCategories || []}
          items={finalItems}
          tableId={tableId}
          restaurantId={restaurantId}
          orderItems={orderItems}
          onRemoveFromOrder={removeFromOrder}
          onAddToOrder={addToOrder}
        />
        
        {usingTestData && (
          <Alert className="my-4">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              You're viewing demo menu items. All functions (adding to cart, ordering, etc.) will work for testing.
            </AlertDescription>
          </Alert>
        )}
        
        {showDebugInfo && (
          <div className="fixed bottom-20 right-4 z-50">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white shadow-md"
              onClick={() => {
                const debugModal = document.createElement('div');
                debugModal.innerHTML = `
                  <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;overflow:auto;padding:20px;">
                    <div style="background:white;max-width:600px;margin:40px auto;padding:20px;border-radius:8px;">
                      <h3 style="font-weight:bold;margin-bottom:10px;">Debug Info</h3>
                      <pre style="background:#f1f1f1;padding:10px;overflow:auto;font-size:12px;">${JSON.stringify({
                        ...debugInfo,
                        usingTestData,
                        categoriesCount: finalCategories?.length || 0,
                        itemsCount: finalItems?.length || 0,
                        orderItemsCount: orderItems?.length || 0
                      }, null, 2)}</pre>
                      <button style="background:#f1f1f1;padding:8px 16px;border-radius:4px;margin-top:10px;">Close</button>
                    </div>
                  </div>
                `;
                document.body.appendChild(debugModal);
                debugModal.querySelector('button')?.addEventListener('click', () => {
                  document.body.removeChild(debugModal);
                });
              }}
            >
              Debug
            </Button>
          </div>
        )}
      </CustomerMenuLayout>
    </PageTransition>
  );
};

export default CustomerMenuPage;
