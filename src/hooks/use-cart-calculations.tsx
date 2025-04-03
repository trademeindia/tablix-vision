
import { CartItem } from './use-cart-storage';

/**
 * Hook for calculating various cart metrics
 */
export function useCartCalculations(orderItems: CartItem[]) {
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
  
  return { totalItems, totalPrice };
}
