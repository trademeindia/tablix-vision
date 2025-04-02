import { useCallback, useState, useEffect } from 'react';
import { MenuItem } from '@/types/menu';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  item: MenuItem;
  quantity: number;
}

interface UseOrderItemsResult {
  orderItems: OrderItem[];
  addToOrder: (item: MenuItem) => void;
  removeFromOrder: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearOrder: () => void;
  totalItems: number;
  totalPrice: number;
  placeOrder: (
    restaurantId: string, 
    tableId: string, 
    customerInfo?: { name: string; email: string; phone?: string; }
  ) => Promise<boolean>;
}

export function useOrderItems(): UseOrderItemsResult {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  // Load saved order from localStorage on initial render
  useEffect(() => {
    const savedOrder = localStorage.getItem('orderItems');
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        if (Array.isArray(parsedOrder)) {
          setOrderItems(parsedOrder);
        }
      } catch (e) {
        console.error("Error parsing saved order:", e);
      }
    }
  }, []);
  
  // Save order to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
  }, [orderItems]);
  
  const addToOrder = useCallback((item: MenuItem) => {
    setOrderItems(prevItems => {
      // Check if the item is already in the order
      const existingItemIndex = prevItems.findIndex(
        orderItem => orderItem.item.id === item.id
      );
      
      if (existingItemIndex >= 0) {
        // If the item exists, increment its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Otherwise, add it as a new item with quantity 1
        return [...prevItems, { item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to order",
      description: `${item.name} has been added to your order.`,
    });
  }, []);
  
  const removeFromOrder = useCallback((itemId: string) => {
    setOrderItems(prevItems => 
      prevItems.filter(orderItem => orderItem.item.id !== itemId)
    );
  }, []);
  
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      removeFromOrder(itemId);
      return;
    }
    
    setOrderItems(prevItems => 
      prevItems.map(orderItem => 
        orderItem.item.id === itemId 
          ? { ...orderItem, quantity } 
          : orderItem
      )
    );
  }, [removeFromOrder]);
  
  const clearOrder = useCallback(() => {
    setOrderItems([]);
    localStorage.removeItem('orderItems');
  }, []);
  
  // Calculate total number of items
  const totalItems = orderItems.reduce(
    (sum, orderItem) => sum + orderItem.quantity, 
    0
  );
  
  // Calculate total price
  const totalPrice = orderItems.reduce(
    (sum, orderItem) => sum + (orderItem.item.price * orderItem.quantity), 
    0
  );
  
  // Mock function to place an order - in a real app this would call a backend API
  const placeOrder = useCallback(async (
    restaurantId: string, 
    tableId: string, 
    customerInfo?: { name: string; email: string; phone?: string; }
  ): Promise<boolean> => {
    try {
      console.log("Placing order:", {
        restaurantId,
        tableId,
        customerInfo,
        items: orderItems,
        total: totalPrice
      });
      
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This is where you would send the order to the backend
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
      
      // Clear the cart after successful order
      clearOrder();
      
      return true;
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Failed to place order",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [orderItems, totalPrice, clearOrder]);
  
  return {
    orderItems,
    addToOrder,
    removeFromOrder,
    updateQuantity,
    clearOrder,
    totalItems,
    totalPrice,
    placeOrder
  };
}
