
import { supabase } from '@/integrations/supabase/client';
import { WaiterRequest } from './types';
import { asWaiterRequest } from './utils';

/**
 * Call a waiter for assistance
 */
export const callWaiter = async (
  restaurantId: string,
  tableNumber: string,
  customerId?: string
): Promise<WaiterRequest | null> => {
  try {
    const waiterRequest = {
      restaurant_id: restaurantId,
      table_number: tableNumber,
      customer_id: customerId,
      status: 'pending',
      request_time: new Date().toISOString(),
    };

    // @ts-ignore - The waiter_requests table is not in the TypeScript definitions yet
    const { data, error } = await supabase
      .from('waiter_requests')
      .insert(waiterRequest)
      .select()
      .single();

    if (error) {
      console.error('Error calling waiter:', error);
      return null;
    }

    return asWaiterRequest(data);
  } catch (error) {
    console.error('Error in callWaiter:', error);
    return null;
  }
};

/**
 * Update waiter request status
 */
export const updateWaiterRequestStatus = async (
  requestId: string,
  status: WaiterRequest['status']
): Promise<WaiterRequest | null> => {
  try {
    const updates: any = {
      status,
    };

    // Add timestamp based on status
    if (status === 'acknowledged') {
      updates.acknowledgement_time = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completion_time = new Date().toISOString();
    }

    // @ts-ignore - The waiter_requests table is not in the TypeScript definitions yet
    const { data, error } = await supabase
      .from('waiter_requests')
      .update(updates)
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating waiter request:', error);
      return null;
    }

    return asWaiterRequest(data);
  } catch (error) {
    console.error('Error in updateWaiterRequestStatus:', error);
    return null;
  }
};
