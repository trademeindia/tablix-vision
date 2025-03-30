
import { supabase } from '@/integrations/supabase/client';
import { WaiterRequest } from './types';

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
