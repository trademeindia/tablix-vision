
import { MenuItem } from '@/types/menu';
import { OrderItem } from './types';
import { formatCurrency as formatCurrencyUtil } from '@/utils/format';

/**
 * Convert cart items to order items
 */
export const convertCartItemsToOrderItems = (cartItems: Array<{ item: MenuItem; quantity: number }>): OrderItem[] => {
  return cartItems.map(({ item, quantity }) => ({
    menu_item_id: item.id,
    name: item.name,
    price: item.price,
    quantity,
    // If there are customizations or special instructions, they would be added here
  }));
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return formatCurrencyUtil(amount);
};

/**
 * Calculate total price of order items
 */
export const calculateTotalPrice = (items: Array<{ item: MenuItem; quantity: number }>): number => {
  return items.reduce((total, { item, quantity }) => total + item.price * quantity, 0);
};
