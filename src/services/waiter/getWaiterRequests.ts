
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
    // Use type assertion to bypass the TypeScript error for table not in schema
    const { data, error } = await supabase
      .from('waiter_requests' as any)
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
    // Use type assertion to bypass the TypeScript error for table not in schema
    const { data, error } = await supabase
      .from('waiter_requests' as any)
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

/**
 * Get waiter requests for a specific table
 */
export const getTableWaiterRequests = async (
  restaurantId: string,
  tableNumber: string
): Promise<WaiterRequest[]> => {
  try {
    // Use type assertion to bypass the TypeScript error for table not in schema
    const { data, error } = await supabase
      .from('waiter_requests' as any)
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('table_number', tableNumber)
      .order('request_time', { ascending: false });

    if (error) {
      console.error('Error fetching table waiter requests:', error);
      return [];
    }

    return asWaiterRequests(data || []);
  } catch (error) {
    console.error('Error in getTableWaiterRequests:', error);
    return [];
  }
};
