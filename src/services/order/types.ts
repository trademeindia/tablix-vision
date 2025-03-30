
import { Json } from '@/integrations/supabase/types';

export interface OrderItem {
  id?: string;
  order_id?: string;
  menu_item_id?: string;
  name: string;
  price: number;
  quantity: number;
  special_instructions?: string;
  customizations?: any;
}

export interface Order {
  id?: string;
  restaurant_id: string;
  table_number: string;
  customer_id?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  total_amount: number;
  created_at?: string;
  payment_status?: 'unpaid' | 'paid';
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  items: OrderItem[];
  estimated_ready_time?: string;
  actual_ready_time?: string;
  user_id?: string;
}

// Type guard to check if the status is a valid Order status
export const isValidOrderStatus = (status: string): status is Order['status'] => {
  return ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'].includes(status as Order['status']);
};

// Helper function to ensure order has required properties
export const ensureOrderProperties = (orderData: any, itemsData: any[]): Order => {
  // Ensure status is properly typed
  const status = orderData.status as Order['status'];
  
  return {
    ...orderData,
    table_number: orderData.table_number || '',
    items: itemsData,
    status: status,
  };
};
