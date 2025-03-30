
import { supabase } from '@/integrations/supabase/client';

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
