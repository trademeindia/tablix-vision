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
    // Create a new array based on the current state
    const updatedItems = [...orderItems];
    
    // Check if the item is already in the order
    const existingItemIndex = updatedItems.findIndex(
      orderItem => orderItem.item.id === item.id
    );
    
    if (existingItemIndex >= 0) {
      // If the item exists, increment its quantity
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
    } else {
      // Otherwise, add it as a new item with quantity 1
      updatedItems.push({ item, quantity: 1 });
    }
    
    // Update the state with the new array
    setOrderItems(updatedItems);
    
    toast({
      title: "Added to order",
      description: `${item.name} has been added to your order.`,
    });
  }, [orderItems, setOrderItems]);
  
  const removeFromOrder = useCallback((itemId: string) => {
    // Filter out the item to be removed
    const updatedItems = orderItems.filter(
      orderItem => orderItem.item.id !== itemId
    );
    
    // Update the state with the filtered array
    setOrderItems(updatedItems);
  }, [orderItems, setOrderItems]);
  
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      removeFromOrder(itemId);
      return;
    }
    
    // Map to create a new array with the updated quantity
    const updatedItems = orderItems.map(orderItem => 
      orderItem.item.id === itemId 
        ? { ...orderItem, quantity } 
        : orderItem
    );
    
    // Update the state with the new array
    setOrderItems(updatedItems);
  }, [orderItems, removeFromOrder, setOrderItems]);
  
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
