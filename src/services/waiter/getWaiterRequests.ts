
import { supabase } from '@/integrations/supabase/client';
import { WaiterRequest } from './types';
import { asWaiterRequests } from './utils';

/**
 * Get all waiter requests for a restaurant
 */
export const getWaiterRequests = async (
  restaurantId: string
): Promise<WaiterRequest[]> => {
  try {
    // @ts-ignore - The waiter_requests table is not in the TypeScript definitions yet
    const { data, error } = await supabase
      .from('waiter_requests')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('request_time', { ascending: false });

    if (error) {
      console.error('Error fetching waiter requests:', error);
      return [];
    }

    return asWaiterRequests(data || []);
  } catch (error) {
    console.error('Error in getWaiterRequests:', error);
    return [];
  }
};

/**
 * Get a waiter request by ID
 */
export const getWaiterRequestById = async (
  requestId: string
): Promise<WaiterRequest | null> => {
  try {
    // @ts-ignore - The waiter_requests table is not in the TypeScript definitions yet
    const { data, error } = await supabase
      .from('waiter_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error) {
      console.error('Error fetching waiter request:', error);
      return null;
    }

    return asWaiterRequests([data])[0];
  } catch (error) {
    console.error('Error in getWaiterRequestById:', error);
    return null;
  }
};
