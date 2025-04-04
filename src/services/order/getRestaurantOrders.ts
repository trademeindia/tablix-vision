
import { supabase } from '@/integrations/supabase/client';
import { Order, ensureOrderProperties } from './types';

/**
 * Get all orders for a restaurant with filtering and pagination
 */
export const getRestaurantOrders = async (
  restaurantId: string,
  options?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
): Promise<{ orders: Order[], count: number }> => {
  try {
    const { 
      status, 
      startDate, 
      endDate,
      page = 1,
      limit = 50
    } = options || {};

    // Calculate range for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Start building the count query
    let countQuery = supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId);
      
    // Apply filters to count query
    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    
    if (startDate) {
      countQuery = countQuery.gte('created_at', startDate);
    }
    
    if (endDate) {
      countQuery = countQuery.lte('created_at', endDate);
    }
    
    // Execute count query
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error('Error counting restaurant orders:', countError);
      return { orders: [], count: 0 };
    }
    
    const totalCount = count || 0;

    // Start building the data query
    let dataQuery = supabase
      .from('orders')
      .select('*')
      .eq('restaurant_id', restaurantId);

    // Apply same filters to data query
    if (status) {
      dataQuery = dataQuery.eq('status', status);
    }

    if (startDate) {
      dataQuery = dataQuery.gte('created_at', startDate);
    }

    if (endDate) {
      dataQuery = dataQuery.lte('created_at', endDate);
    }

    // Execute data query with pagination
    const { data: ordersData, error: ordersError } = await dataQuery
      .order('created_at', { ascending: false })
      .range(from, to);

    if (ordersError) {
      console.error('Error fetching restaurant orders:', ordersError);
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
    console.error('Error in getRestaurantOrders:', error);
    return { orders: [], count: 0 };
  }
};
