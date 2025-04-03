
import { useCallback, useState, useEffect } from 'react';
import { MenuItem } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import { createOrder } from '@/services/order';
import { useCustomerInfoStorage } from '@/hooks/use-checkout-storage';

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
  const { getCustomerInfo } = useCustomerInfoStorage();
  
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
  
  // Real function to place an order using Supabase
  const placeOrder = useCallback(async (
    restaurantId: string, 
    tableId: string, 
    customerInfo?: { name: string; email: string; phone?: string; }
  ): Promise<boolean> => {
    try {
      const customer = customerInfo || getCustomerInfo();
      
      if (!restaurantId || !tableId) {
        toast({
          title: "Missing Information",
          description: "Restaurant or table information is missing",
          variant: "destructive"
        });
        return false;
      }
      
      if (orderItems.length === 0) {
        toast({
          title: "Empty Order",
          description: "Your order is empty. Please add items before placing an order.",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Processing Order",
        description: "Please wait while we process your order...",
      });
      
      // Prepare order items for the API
      const orderItemsForAPI = orderItems.map(({ item, quantity }) => ({
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity,
      }));
      
      // Calculate total amount
      const totalAmount = orderItems.reduce(
        (total, { item, quantity }) => total + (item.price * quantity), 
        0
      );
      
      // Create the order in Supabase
      const order = await createOrder({
        restaurant_id: restaurantId,
        table_number: tableId,
        customer_id: undefined, // This would come from auth in a real implementation
        total_amount: totalAmount,
        items: orderItemsForAPI,
        notes: '',
      });
      
      if (!order) {
        throw new Error("Failed to create order");
      }
      
      // Clear the cart after successful order
      clearOrder();
      
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
      
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
  }, [orderItems, clearOrder, getCustomerInfo]);
  
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
