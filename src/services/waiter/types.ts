
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
