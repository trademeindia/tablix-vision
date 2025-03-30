
import { supabase } from '@/integrations/supabase/client';
import { MenuItem } from '@/types/menu';

export interface OrderItem {
  id?: string;
  order_id?: string;
  menu_item_id?: string;
  name: string;
  price: number;
  quantity: number;
  special_instructions?: string;
  customizations?: any;
}

export interface Order {
  id?: string;
  restaurant_id: string;
  table_number: string;
  customer_id?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  total_amount: number;
  created_at?: string;
  payment_status?: 'unpaid' | 'paid';
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  items: OrderItem[];
  estimated_ready_time?: string;
  actual_ready_time?: string;
  user_id?: string;
}

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

    return {
      ...orderData,
      items: itemsData,
      status: orderData.status as 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
    };
  } catch (error) {
    console.error('Error in createOrder:', error);
    return null;
  }
};

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

    // Combine the data
    return {
      ...orderData,
      items: itemsData,
      status: orderData.status as 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
    };
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

        return {
          ...order,
          items: itemsData,
          status: order.status as 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
        };
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

        return {
          ...order,
          items: itemsData,
          status: order.status as 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
        };
      })
    );

    return orders.filter((order): order is Order => order !== null);
  } catch (error) {
    console.error('Error in getRestaurantOrders:', error);
    return [];
  }
};

/**
 * Update an order's status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
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
