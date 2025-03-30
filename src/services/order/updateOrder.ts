
import { supabase } from '@/integrations/supabase/client';
import { Order } from './types';

/**
 * Update an order's status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    return false;
  }
};
