import { useCallback } from 'react';
import { MenuItem } from '@/types/menu';
import { CartItem } from './use-cart-storage';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for cart item operations (add, remove, update)
 */
export function useCartOperations(
  orderItems: CartItem[], 
  setOrderItems: (items: CartItem[]) => void
) {
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
  }, [setOrderItems]);
  
  const removeFromOrder = useCallback((itemId: string) => {
    setOrderItems(prevItems => 
      prevItems.filter(orderItem => orderItem.item.id !== itemId)
    );
  }, [setOrderItems]);
  
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
  }, [removeFromOrder, setOrderItems]);
  
  const clearOrder = useCallback(() => {
    setOrderItems([]);
    localStorage.removeItem('orderItems');
  }, [setOrderItems]);
  
  return {
    addToOrder,
    removeFromOrder,
    updateQuantity,
    clearOrder
  };
}
