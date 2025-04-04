
import { supabase } from '@/integrations/supabase/client';
import { Order, ensureOrderProperties } from './types';

/**
 * Get recent orders for restaurant dashboard
 */
export const getRecentOrders = async (
  restaurantId: string, 
  limit = 5
): Promise<Order[]> => {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (ordersError) {
      console.error('Error fetching recent orders:', ordersError);
      return [];
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

    return orders.filter((order): order is Order => order !== null);
  } catch (error) {
    console.error('Error in getRecentOrders:', error);
    return [];
  }
};
