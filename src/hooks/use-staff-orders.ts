
import { useState, useEffect } from 'react';
import { generateActiveOrders, generateCompletedOrders } from '@/utils/demo-data/order-data';

export function useStaffOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  
  // Load demo data
  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate demo data
      const activeOrdersData = generateActiveOrders(8);
      const completedOrdersData = generateCompletedOrders(12);
      
      setActiveOrders(activeOrdersData);
      setCompletedOrders(completedOrdersData);
      setIsLoading(false);
    };
    
    fetchOrderData();
  }, []);
  
  // Helper to update order status
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would call an API to update the status
    setActiveOrders(orders => orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    // If status is completed, move order to completed list
    if (newStatus === 'completed') {
      const orderToMove = activeOrders.find(order => order.id === orderId);
      if (orderToMove) {
        const updatedOrder = { ...orderToMove, status: 'completed', paymentStatus: 'paid' };
        setActiveOrders(orders => orders.filter(order => order.id !== orderId));
        setCompletedOrders(orders => [updatedOrder, ...orders]);
      }
    }
  };

  return {
    isLoading,
    activeOrders,
    completedOrders,
    handleUpdateStatus
  };
}
