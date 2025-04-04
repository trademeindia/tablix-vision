
import { supabase } from '@/integrations/supabase/client';
import { Order, ensureOrderProperties } from './types';

/**
 * Get all orders for a customer with pagination
 */
export const getCustomerOrders = async (
  customerId: string,
  page = 1,
  limit = 20
): Promise<{ orders: Order[], count: number }> => {
  try {
    // Calculate range for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get count for pagination - Fixed by using a separate count query
    const { count, error: countError } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('customer_id', customerId);
    
    if (countError) {
      console.error('Error fetching order count:', countError);
      return { orders: [], count: 0 };
    }
    
    const totalCount = count || 0;

    // Get the order headers with pagination
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (ordersError) {
      console.error('Error fetching customer orders:', ordersError);
      return { orders: [], count: 0 };
    }

    // For each order, get the items and combine the data
    const orders = await Promise.all(
      ordersData.map(async (order) => {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (itemsError) {
          console.error('Error fetching order items:', itemsError);
          return null;
        }

        return ensureOrderProperties(order, itemsData);
      })
    );

    return { 
      orders: orders.filter((order): order is Order => order !== null),
      count: totalCount
    };
  } catch (error) {
    console.error('Error in getCustomerOrders:', error);
    return { orders: [], count: 0 };
  }
};
