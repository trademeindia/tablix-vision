
export interface WaiterRequest {
  id: string;
  restaurant_id: string;
  table_number: string;
  customer_id?: string | null;
  status: 'pending' | 'acknowledged' | 'completed' | 'cancelled';
  request_time: string;
  acknowledgement_time?: string | null;
  completion_time?: string | null;
}

// Response structure for callWaiter function
export interface WaiterCallResponse {
  success: boolean;
  data?: WaiterRequest | null;
  error?: string;
}
