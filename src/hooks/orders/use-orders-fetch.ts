
import { useState, useCallback } from 'react';
import { getRestaurantOrders } from '@/services/order';
import { toast } from '@/hooks/use-toast';
import { OrderFilters } from './types';

export function useOrdersFetch(restaurantId: string, filters: OrderFilters = {}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [count, setCount] = useState(0);
  
  const fetchOrders = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { orders: data, count: totalCount } = await getRestaurantOrders(restaurantId, {
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      
      // Sort the data based on filter criteria
      let sortedData = [...data];
      if (filters.sortBy) {
        sortedData.sort((a, b) => {
          // Handle different sort fields
          const sortField = filters.sortBy as keyof typeof a;
          const aValue = a[sortField];
          const bValue = b[sortField];
          
          // Handle specific field types
          if (sortField === 'total_amount') {
            return filters.sortDirection === 'asc' 
              ? (Number(aValue || 0) - Number(bValue || 0)) 
              : (Number(bValue || 0) - Number(aValue || 0));
          }
          
          // Default string comparison
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return filters.sortDirection === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          
          // Date comparison
          if (sortField === 'created_at' || sortField === 'updated_at') {
            const dateA = aValue ? new Date(aValue as string).getTime() : 0;
            const dateB = bValue ? new Date(bValue as string).getTime() : 0;
            return filters.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
          }
          
          return 0;
        });
      }
      
      setOrders(sortedData);
      setCount(totalCount);
      
      // Filter orders for the tabs
      setActiveOrders(sortedData.filter(order => 
        order.status !== 'completed' && order.status !== 'served' && order.status !== 'cancelled'
      ));
      
      setCompletedOrders(sortedData.filter(order => 
        order.status === 'completed' || order.status === 'served'
      ));
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error fetching orders",
        description: "Could not load your orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [restaurantId, filters]);

  return {
    orders,
    activeOrders,
    completedOrders,
    isLoading,
    isRefreshing,
    count,
    setOrders,
    setActiveOrders,
    setCompletedOrders,
    fetchOrders,
  };
}
