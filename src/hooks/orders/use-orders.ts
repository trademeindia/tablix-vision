
import { useEffect } from 'react';
import { useOrdersFetch } from './use-orders-fetch';
import { useOrdersRealtime } from './use-orders-realtime';
import { OrderFilters, UseOrdersResult } from './types';

export function useOrders(
  restaurantId: string, 
  filters: OrderFilters = {}
): UseOrdersResult {
  const {
    orders,
    activeOrders,
    completedOrders,
    isLoading,
    isRefreshing,
    count,
    fetchOrders
  } = useOrdersFetch(restaurantId, filters);
  
  const { realtimeStatus } = useOrdersRealtime(restaurantId, fetchOrders);
  
  // Initial fetch on mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  return {
    orders,
    activeOrders,
    completedOrders,
    isLoading,
    isRefreshing,
    count,
    fetchOrders,
    realtimeStatus
  };
}
