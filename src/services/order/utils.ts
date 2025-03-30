
import { MenuItem } from '@/types/menu';
import { OrderItem } from './types';

/**
 * Convert cart items to order items
 */
export const convertCartItemsToOrderItems = (cartItems: Array<{ item: MenuItem; quantity: number }>): OrderItem[] => {
  return cartItems.map(({ item, quantity }) => ({
    menu_item_id: item.id,
    name: item.name,
    price: item.price,
    quantity,
  }));
};
