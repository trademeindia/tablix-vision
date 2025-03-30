
import { supabase } from '@/integrations/supabase/client';

export interface WaiterRequest {
  id?: string;
  restaurant_id: string;
  table_number: string;
  customer_id?: string | null;
  status: 'pending' | 'acknowledged' | 'completed';
  request_time?: string;
  acknowledgement_time?: string | null;
  completion_time?: string | null;
}

/**
 * Create a new waiter request
 */
export const callWaiter = async (
  restaurantId: string,
  tableNumber: string,
  customerId?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // First check if there's already a pending request for this table
    const { data: existingRequests, error: checkError } = await supabase
      .from('waiter_requests')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('table_number', tableNumber)
      .eq('status', 'pending');
      
    if (checkError) {
      console.error('Error checking existing waiter requests:', checkError);
      return { success: false, error: checkError.message };
    }
    
    // If there's already a pending request, don't create a new one
    if (existingRequests && existingRequests.length > 0) {
      return { success: true }; // Return success but don't create duplicate
    }

    const { data, error } = await supabase
      .from('waiter_requests')
      .insert({
        restaurant_id: restaurantId,
        table_number: tableNumber,
        customer_id: customerId || null,
        status: 'pending',
        request_time: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error calling waiter:', error);
      return { success: false, error: error.message };
    }

    // Use Supabase Realtime to notify staff
    const channel = supabase.channel('waiter-requests');
    await channel.send({
      type: 'broadcast',
      event: 'waiter-request',
      payload: { 
        requestId: data[0]?.id,
        restaurantId,
        tableNumber,
        status: 'pending' 
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error calling waiter:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all waiter requests for a specific table
 */
export const getTableWaiterRequests = async (
  restaurantId: string,
  tableNumber: string
): Promise<WaiterRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('waiter_requests')
      .select()
      .eq('restaurant_id', restaurantId)
      .eq('table_number', tableNumber)
      .order('request_time', { ascending: false });

    if (error) {
      console.error('Error fetching waiter requests:', error);
      return [];
    }

    return data as WaiterRequest[];
  } catch (error) {
    console.error('Error fetching waiter requests:', error);
    return [];
  }
};
