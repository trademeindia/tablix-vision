
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/menu';

interface OrderItem {
  item: MenuItem;
  quantity: number;
}

interface UseOrderItemsResult {
  orderItems: OrderItem[];
  addToOrder: (item: MenuItem) => void;
  removeFromOrder: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearOrder: () => void;
  totalItems: number;
  totalPrice: number;
}

export function useOrderItems(): UseOrderItemsResult {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  // Load stored order from localStorage on mount
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
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
  }, [orderItems]);
  
  // Add item to order
  const addToOrder = (item: MenuItem) => {
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
  const removeFromOrder = (itemId: string) => {
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

  // Increase quantity of an item
  const increaseQuantity = (itemId: string) => {
    setOrderItems(prev => {
      const existingItemIndex = prev.findIndex(orderItem => orderItem.item.id === itemId);
      
      if (existingItemIndex >= 0) {
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      }
      return prev;
    });
  };

  // Decrease quantity of an item
  const decreaseQuantity = (itemId: string) => {
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
  
  // Clear the entire order
  const clearOrder = () => {
    setOrderItems([]);
    localStorage.removeItem('orderItems');
  };
  
  // Calculate total items
  const totalItems = orderItems.reduce(
    (total, { quantity }) => total + quantity, 
    0
  );
  
  // Calculate total price
  const totalPrice = orderItems.reduce(
    (total, { item, quantity }) => total + item.price * quantity, 
    0
  );
  
  return { 
    orderItems, 
    addToOrder, 
    removeFromOrder, 
    increaseQuantity,
    decreaseQuantity,
    clearOrder, 
    totalItems,
    totalPrice
  };
}
