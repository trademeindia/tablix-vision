
import { useState, useEffect, useCallback } from 'react';
import { KitchenOrder } from './types';
import { useKitchenDataFetcher } from './use-kitchen-data-fetcher';
import { useKitchenOrderOperations } from './use-kitchen-order-operations';
import { useKitchenRealtime } from './use-kitchen-realtime';

export function useKitchenOrderItems() {
  const [pendingOrders, setPendingOrders] = useState<KitchenOrder[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<KitchenOrder[]>([]);
  const restaurantId = "mock-restaurant-id";

  const { fetchOrders, isLoading } = useKitchenDataFetcher(restaurantId);
  const { toggleItemCompletion, updateOrderStatus, areAllItemsCompleted } = useKitchenOrderOperations();

  const refreshOrders = useCallback(async () => {
    const orders = await fetchOrders();
    
    const pendingOrdersData = orders.filter(order => order.status === 'pending');
    const preparingOrdersData = orders.filter(order => order.status === 'preparing');
    
    setPendingOrders(pendingOrdersData);
    setPreparingOrders(preparingOrdersData);
  }, [fetchOrders]);

  // Handler for toggling item completion that updates local state
  const handleToggleItemCompletion = useCallback(async (orderId: string, itemId: string) => {
    const result = await toggleItemCompletion(orderId, itemId);
    
    if (result) {
      const { itemId, orderId, newCompletedStatus } = result;
      
      const updateOrderItems = (orders: KitchenOrder[]) => {
        return orders.map(order => {
          if (order.id === orderId) {
            const updatedItems = order.items.map(item => {
              if (item.id === itemId) {
                return {
                  ...item,
                  completed: newCompletedStatus
                };
              }
              return item;
            });
            
            return {
              ...order,
              items: updatedItems
            };
          }
          return order;
        });
      };

      setPreparingOrders(prev => updateOrderItems(prev));
      setPendingOrders(prev => updateOrderItems(prev));
    }
  }, [toggleItemCompletion]);

  // Handler for updating order status that updates local state
  const handleUpdateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result) {
      if (newStatus === 'preparing') {
        const orderToMove = pendingOrders.find(order => order.id === orderId);
        if (orderToMove) {
          setPendingOrders(prev => prev.filter(order => order.id !== orderId));
          setPreparingOrders(prev => [...prev, { ...orderToMove, status: newStatus }]);
        }
      } else if (newStatus === 'ready') {
        setPreparingOrders(prev => prev.filter(order => order.id !== orderId));
      }
    }
  }, [updateOrderStatus, pendingOrders]);

  // Set up Realtime subscriptions
  const { isSubscribed } = useKitchenRealtime(refreshOrders, refreshOrders);

  // Initial data fetch
  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  // Check if all items in an order are completed
  const checkAllItemsCompleted = useCallback((orderId: string) => {
    const order = [...preparingOrders, ...pendingOrders].find(o => o.id === orderId);
    if (!order) return false;
    
    return areAllItemsCompleted(order);
  }, [preparingOrders, pendingOrders, areAllItemsCompleted]);

  return {
    pendingOrders,
    preparingOrders,
    isLoading,
    isSubscribed,
    toggleItemCompletion: handleToggleItemCompletion,
    updateOrderStatus: handleUpdateOrderStatus,
    areAllItemsCompleted: checkAllItemsCompleted
  };
}

// Re-export all kitchen hooks and types
export * from './types';
