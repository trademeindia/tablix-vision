
import { supabase } from '@/integrations/supabase/client';
import { MenuItem } from '@/types/menu';
import { Customer } from './customerService';

// Order types
export interface OrderItem {
  id?: string;
  order_id?: string;
  menu_item_id?: string;
  name: string;
  price: number;
  quantity: number;
  special_instructions?: string;
}

export interface Order {
  id?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  restaurant_id: string;
  table_id: string;
  status?: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  payment_status?: 'unpaid' | 'paid';
  payment_method?: string;
  special_instructions?: string;
  total_amount?: number;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

/**
 * Create a new order in the database
 */
export const createOrder = async (order: Order, orderItems: OrderItem[]): Promise<Order | null> => {
  try {
    // Calculate total amount
    const totalAmount = orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Insert the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: order.customer_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        restaurant_id: order.restaurant_id,
        table_id: order.table_id,
        status: 'pending',
        payment_status: 'unpaid',
        payment_method: order.payment_method || 'cash',
        special_instructions: order.special_instructions,
        total_amount: totalAmount
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }

    // Insert order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId)
      .select();

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Consider rolling back the order if items insertion fails
      return null;
    }

    return {
      ...orderData,
      items: itemsData
    };
  } catch (error) {
    console.error('Error in createOrder:', error);
    return null;
  }
};

/**
 * Get an order by ID
 */
export const getOrder = async (orderId: string): Promise<Order | null> => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderError) {
    console.error('Error fetching order:', orderError);
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return null;
  }

  return {
    ...order,
    items: items
  };
};

/**
 * Convert cart items to order items format
 */
export const convertCartToOrderItems = (cartItems: Array<{item: MenuItem, quantity: number}>): OrderItem[] => {
  return cartItems.map(({ item, quantity }) => ({
    menu_item_id: item.id,
    name: item.name,
    price: item.price,
    quantity: quantity
  }));
};
