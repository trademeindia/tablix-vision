
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

    // Start building the query
    let query = supabase
      .from('orders')
      .select('*')
      .eq('restaurant_id', restaurantId);

    // Add filters if provided
    if (status) {
      query = query.eq('status', status);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Get count first for pagination info - properly handling count query
    let countQuery = supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId);
      
    // Apply same filters to count query
    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    
    if (startDate) {
      countQuery = countQuery.gte('created_at', startDate);
    }
    
    if (endDate) {
      countQuery = countQuery.lte('created_at', endDate);
    }
    
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error('Error counting restaurant orders:', countError);
      return { orders: [], count: 0 };
    }
    
    const totalCount = count || 0;

    // Then get actual data with pagination
    const { data: ordersData, error: ordersError } = await query
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
