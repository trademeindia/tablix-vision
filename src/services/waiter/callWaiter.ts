
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
    // @ts-ignore - The waiter_requests table is not in the TypeScript definitions yet
    const { data, error } = await supabase
      .from('waiter_requests')
      .insert({
        restaurant_id: restaurantId,
        table_number: tableNumber,
        customer_id: customerId || null,
        status: 'pending',
        request_time: new Date().toISOString()
      })
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
 * Update a waiter request status
 */
export const updateWaiterRequestStatus = async (
  requestId: string,
  status: WaiterRequest['status']
): Promise<boolean> => {
  try {
    const updateData: Record<string, any> = { status };
    
    // Add timestamp based on status
    if (status === 'acknowledged') {
      updateData.acknowledgement_time = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.completion_time = new Date().toISOString();
    }
    
    // @ts-ignore - The waiter_requests table is not in the TypeScript definitions yet
    const { error } = await supabase
      .from('waiter_requests')
      .update(updateData)
      .eq('id', requestId);

    if (error) {
      console.error('Error updating waiter request status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateWaiterRequestStatus:', error);
    return false;
  }
};
