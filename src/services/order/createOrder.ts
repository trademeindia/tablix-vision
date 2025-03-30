
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, ensureOrderProperties } from './types';

/**
 * Create a new order
 */
export const createOrder = async (
  order: {
    restaurant_id: string;
    table_number: string;
    customer_id?: string;
    total_amount: number;
    notes?: string;
    items: Array<{
      menu_item_id?: string;
      name: string;
      price: number;
      quantity: number;
      special_instructions?: string;
      customizations?: any;
    }>;
  }
): Promise<Order | null> => {
  try {
    // First create the order header
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        restaurant_id: order.restaurant_id,
        table_number: order.table_number,
        customer_id: order.customer_id || null,
        total_amount: order.total_amount,
        status: 'pending' as const,
        payment_status: 'unpaid',
        notes: order.notes || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }

    // Then create the order items
    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      menu_item_id: item.menu_item_id || null,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      special_instructions: item.special_instructions || null,
      customizations: item.customizations || null,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return null;
    }

    return ensureOrderProperties(orderData, itemsData);
  } catch (error) {
    console.error('Error in createOrder:', error);
    return null;
  }
};
