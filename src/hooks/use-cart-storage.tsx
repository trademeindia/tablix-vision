
import { useEffect, useState } from 'react';
import { MenuItem } from '@/types/menu';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

/**
 * Hook for managing cart storage in localStorage
 */
export function useCartStorage() {
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  
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
  
  return { orderItems, setOrderItems };
}
