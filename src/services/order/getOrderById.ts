
import { supabase } from '@/integrations/supabase/client';
import { Order, ensureOrderProperties } from './types';

/**
 * Get an order by ID with items in a single query using joins
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    // Get the order header
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      return null;
    }

    // Get the order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return null;
    }

    return ensureOrderProperties(orderData, itemsData);
  } catch (error) {
    console.error('Error in getOrderById:', error);
    return null;
  }
};
