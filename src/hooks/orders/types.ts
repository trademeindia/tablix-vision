
export interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface UseOrdersResult {
  orders: any[];
  activeOrders: any[];
  completedOrders: any[];
  isLoading: boolean;
  isRefreshing: boolean;
  count: number;
  fetchOrders: () => Promise<void>;
  realtimeStatus: 'connected' | 'disconnected' | 'error';
}
