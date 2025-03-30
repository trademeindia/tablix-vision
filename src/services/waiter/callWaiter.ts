
import { supabase } from '@/integrations/supabase/client';
import { WaiterRequest, WaiterCallResponse } from './types';
import { asWaiterRequest } from './utils';

/**
 * Call a waiter for assistance
 */
export const callWaiter = async (
  restaurantId: string,
  tableNumber: string,
  customerId?: string
): Promise<WaiterCallResponse> => {
  try {
    const waiterRequest = {
      restaurant_id: restaurantId,
      table_number: tableNumber,
      customer_id: customerId,
      status: 'pending',
      request_time: new Date().toISOString(),
    };

    // Use type assertion to bypass the TypeScript error for table not in schema
    const { data, error } = await supabase
      .from('waiter_requests' as any)
      .insert(waiterRequest)
      .select()
      .single();

    if (error) {
      console.error('Error calling waiter:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: asWaiterRequest(data)
    };
  } catch (error) {
    console.error('Error in callWaiter:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Update waiter request status
 */
export const updateWaiterRequestStatus = async (
  requestId: string,
  status: WaiterRequest['status']
): Promise<WaiterCallResponse> => {
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

    // Use type assertion to bypass the TypeScript error for table not in schema
    const { data, error } = await supabase
      .from('waiter_requests' as any)
      .update(updates)
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating waiter request:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: asWaiterRequest(data)
    };
  } catch (error) {
    console.error('Error in updateWaiterRequestStatus:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
