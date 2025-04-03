
import { supabase } from '@/integrations/supabase/client';
import { Order, isValidOrderStatus } from './types';

/**
 * Update an order's status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!orderId) {
      return { success: false, message: 'Order ID is required' };
    }
    
    if (!isValidOrderStatus(status)) {
      return { success: false, message: `Invalid status: ${status}` };
    }

    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Update multiple order fields
 */
export const updateOrder = async (
  orderId: string,
  updates: Partial<Order>
): Promise<{ success: boolean; message?: string; order?: Order }> => {
  try {
    if (!orderId) {
      return { success: false, message: 'Order ID is required' };
    }
    
    // Validate status if it's included in updates
    if (updates.status && !isValidOrderStatus(updates.status)) {
      return { success: false, message: `Invalid status: ${updates.status}` };
    }
    
    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .update(updatedData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return { success: false, message: error.message };
    }

    // Get the order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return { 
        success: true, 
        message: 'Order updated but failed to retrieve items',
        order: data as Order
      };
    }

    const order = {
      ...data,
      items: itemsData || []
    } as Order;

    return { success: true, order };
  } catch (error) {
    console.error('Error in updateOrder:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
