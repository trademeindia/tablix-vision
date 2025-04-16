
import { OrderItem as SupabaseOrderItem } from '@/services/order/types';

export interface KitchenOrderItem {
  id: string;
  menuItem: {
    name: string;
    image?: string;
  };
  quantity: number;
  completed: boolean;
}

export interface KitchenOrder {
  id: string;
  tableNumber: string;
  customerName: string;
  items: KitchenOrderItem[];
  status: string;
  total: number;
  createdAt: string;
}

export interface KitchenState {
  pendingOrders: KitchenOrder[];
  preparingOrders: KitchenOrder[];
  isLoading: boolean;
  isSubscribed: boolean;
}
