
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQRCode } from '@/hooks/use-qr-code';
import QRScanner from '@/components/customer/QRScanner';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import MenuCategories from '@/components/customer/menu/MenuCategories';
import MenuItems from '@/components/customer/menu/MenuItems';
import OrderSummary from '@/components/customer/menu/OrderSummary';
import { useMenuData } from '@/hooks/use-menu-data';
import { Loader2 } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const CustomerMenuPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tableId, setTableId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Array<{item: MenuItem, quantity: number}>>([]);
  
  // Get QR code data from URL or localStorage
  const { isScanning, startScanning, qrData, handleScan } = useQRCode();
  
  // Parse restaurant and table from QR data or URL params
  useEffect(() => {
    // First check URL parameters
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    const restaurantParam = params.get('restaurant');
    
    // If URL has parameters, use those
    if (tableParam && restaurantParam) {
      setTableId(tableParam);
      setRestaurantId(restaurantParam);
      localStorage.setItem('tableId', tableParam);
      localStorage.setItem('restaurantId', restaurantParam);
      return;
    }
    
    // Next check if we have QR data
    if (qrData) {
      try {
        // Try different QR code formats
        
        // Format 1: https://restaurant.app/menu/{restaurantId}?table={tableId}
        try {
          const url = new URL(qrData);
          const pathParts = url.pathname.split('/');
          const qrRestaurantId = pathParts[pathParts.length - 1];
          const qrTableId = url.searchParams.get('table');
          
          if (qrRestaurantId && qrTableId) {
            setRestaurantId(qrRestaurantId);
            setTableId(qrTableId);
            localStorage.setItem('tableId', qrTableId);
            localStorage.setItem('restaurantId', qrRestaurantId);
            return;
          }
        } catch (e) {
          // Not a URL format, try other formats
        }
        
        // Format 2: JSON string {"restaurantId": "xxx", "tableId": "yyy"}
        try {
          const jsonData = JSON.parse(qrData);
          if (jsonData.restaurantId && jsonData.tableId) {
            setRestaurantId(jsonData.restaurantId);
            setTableId(jsonData.tableId);
            localStorage.setItem('tableId', jsonData.tableId);
            localStorage.setItem('restaurantId', jsonData.restaurantId);
            return;
          }
        } catch (e) {
          // Not JSON format, try other formats
        }
        
        // Format 3: Simple text format "restaurantId:tableId"
        const parts = qrData.split(':');
        if (parts.length === 2) {
          const [qrRestaurantId, qrTableId] = parts;
          setRestaurantId(qrRestaurantId);
          setTableId(qrTableId);
          localStorage.setItem('tableId', qrTableId);
          localStorage.setItem('restaurantId', qrRestaurantId);
          return;
        }
        
        // If all format parsing failed
        toast({
          title: "Invalid QR Code",
          description: "The QR code format is not recognized. Please try again.",
          variant: "destructive",
        });
        
      } catch (error) {
        console.error('Error parsing QR data:', error);
      }
    }
    
    // Finally, check localStorage for returning customers
    const storedTableId = localStorage.getItem('tableId');
    const storedRestaurantId = localStorage.getItem('restaurantId');
    
    if (storedTableId && storedRestaurantId) {
      setTableId(storedTableId);
      setRestaurantId(storedRestaurantId);
    }
  }, [location.search, qrData]);
  
  // Try to load stored order from localStorage
  useEffect(() => {
    const storedOrder = localStorage.getItem('orderItems');
    if (storedOrder) {
      try {
        setOrderItems(JSON.parse(storedOrder));
      } catch (error) {
        console.error('Error parsing stored order:', error);
      }
    }
  }, []);
  
  // Persist order changes to localStorage
  useEffect(() => {
    if (orderItems.length > 0) {
      localStorage.setItem('orderItems', JSON.stringify(orderItems));
    }
  }, [orderItems]);
  
  // Fetch menu data using the hook
  const { categories, items, isLoading, error } = useMenuData(restaurantId);
  
  // Set first category as selected by default when categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);
  
  // Add item to order
  const handleAddToOrder = (item: MenuItem) => {
    setOrderItems(prev => {
      // Check if item already exists in order
      const existingItemIndex = prev.findIndex(orderItem => orderItem.item.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      } else {
        // Item doesn't exist, add it with quantity 1
        return [...prev, { item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to Order",
      description: `${item.name} added to your order.`,
    });
  };
  
  // Remove item from order
  const handleRemoveFromOrder = (itemId: string) => {
    setOrderItems(prev => {
      const existingItemIndex = prev.findIndex(orderItem => orderItem.item.id === itemId);
      
      if (existingItemIndex >= 0) {
        const newItems = [...prev];
        if (newItems[existingItemIndex].quantity > 1) {
          // Decrement quantity if more than 1
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity - 1
          };
        } else {
          // Remove item if quantity is 1
          newItems.splice(existingItemIndex, 1);
        }
        return newItems;
      }
      return prev;
    });
  };
  
  // Proceed to checkout
  const handleCheckout = () => {
    // Store order items in localStorage for the checkout page
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
    navigate(`/checkout?table=${tableId}&restaurant=${restaurantId}`);
  };
  
  // If no restaurant/table data, show QR scanner
  if (!restaurantId || !tableId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">Scan Table QR Code</h1>
        {isScanning ? (
          <QRScanner 
            onScan={(data) => {
              if (data) {
                console.log('QR Code scanned:', data);
                handleScan(data);
              }
            }}
            onClose={() => navigate('/')}
          />
        ) : (
          <Button onClick={startScanning} size="lg">
            Scan QR Code
          </Button>
        )}
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
        <p className="text-center mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  return (
    <CustomerMenuLayout 
      tableId={tableId} 
      restaurantId={restaurantId}
      orderItemsCount={orderItems.reduce((total, item) => total + item.quantity, 0)}
    >
      <div className="mb-4 sticky top-16 bg-background z-10 pb-2 pt-4">
        <MenuCategories 
          categories={categories || []} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>
      
      <MenuItems 
        items={items?.filter(item => 
          selectedCategory ? item.category_id === selectedCategory : true
        ) || []} 
        onAddToOrder={handleAddToOrder} 
      />
      
      {orderItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
          <OrderSummary 
            orderItems={orderItems} 
            onRemoveItem={handleRemoveFromOrder} 
            onCheckout={handleCheckout}
          />
        </div>
      )}
    </CustomerMenuLayout>
  );
};

export default CustomerMenuPage;
