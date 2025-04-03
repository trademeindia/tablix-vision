
import { MenuItem } from '@/types/menu';
import { useCartStorage, CartItem } from './use-cart-storage';
import { useCartCalculations } from './use-cart-calculations';
import { useCartOperations } from './use-cart-operations';
import { useOrderPlacement } from './use-order-placement';

// Re-export CartItem to maintain the same interface
export type { CartItem };

interface UseOrderItemsResult {
  orderItems: CartItem[];
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

/**
 * Main hook for order item management
 */
export function useOrderItems(): UseOrderItemsResult {
  // Use the smaller hooks we've created
  const { orderItems, setOrderItems } = useCartStorage();
  const { totalItems, totalPrice } = useCartCalculations(orderItems);
  const { addToOrder, removeFromOrder, updateQuantity, clearOrder } = useCartOperations(orderItems, setOrderItems);
  const { placeOrder } = useOrderPlacement(orderItems, clearOrder);
  
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
