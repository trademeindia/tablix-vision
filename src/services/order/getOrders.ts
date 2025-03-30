
import { supabase } from '@/integrations/supabase/client';
import { Order, ensureOrderProperties } from './types';

/**
 * Get an order by ID
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
 * Get all orders for a customer
 */
export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  try {
    // Get the order headers
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching customer orders:', ordersError);
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
    console.error('Error in getCustomerOrders:', error);
    return [];
  }
};

/**
 * Get all orders for a restaurant
 */
export const getRestaurantOrders = async (restaurantId: string): Promise<Order[]> => {
  try {
    // Get the order headers
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching restaurant orders:', ordersError);
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
    console.error('Error in getRestaurantOrders:', error);
    return [];
  }
};
