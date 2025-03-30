
import { WaiterRequest } from './types';

/**
 * Helper function to safely cast database rows to WaiterRequest type
 */
export const asWaiterRequest = (data: any): WaiterRequest => {
  return {
    id: data.id,
    restaurant_id: data.restaurant_id,
    table_number: data.table_number || String(data.table_id || ''),
    customer_id: data.customer_id,
    status: data.status as WaiterRequest['status'],
    request_time: data.request_time,
    acknowledgement_time: data.acknowledgement_time,
    completion_time: data.completion_time
  };
};

/**
 * Helper function to safely cast an array of database rows to WaiterRequest[] type
 */
export const asWaiterRequests = (data: any[]): WaiterRequest[] => {
  return data.map(row => asWaiterRequest(row));
};
