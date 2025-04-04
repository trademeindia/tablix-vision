import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { updateOrderStatus } from '@/services/order';
import { supabase } from '@/integrations/supabase/client';

// Mock data for active orders
const mockActiveOrders = [
  {
    id: 'order-001',
    tableNumber: 'Table 5',
    customerName: 'John Doe',
    items: [
      { id: 'item-1', menuItem: { name: 'Butter Chicken', image: '' }, quantity: 2 },
      { id: 'item-2', menuItem: { name: 'Garlic Naan', image: '' }, quantity: 4 },
      { id: 'item-3', menuItem: { name: 'Cucumber Raita', image: '' }, quantity: 1 },
    ],
    status: 'pending',
    total: 950.00,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'order-002',
    tableNumber: 'Table 8',
    customerName: 'Jane Smith',
    items: [
      { id: 'item-4', menuItem: { name: 'Paneer Tikka', image: '' }, quantity: 1 },
      { id: 'item-5', menuItem: { name: 'Vegetable Biryani', image: '' }, quantity: 2 },
    ],
    status: 'preparing',
    total: 645.00,
    createdAt: new Date().toISOString(),
  },
];

// Mock data for completed orders
const mockCompletedOrders = [
  {
    id: 'order-003',
    tableNumber: 'Table 3',
    customerName: 'Michael Johnson',
    items: [
      { id: 'item-6', menuItem: { name: 'Chicken Biryani', image: '' }, quantity: 1 },
      { id: 'item-7', menuItem: { name: 'Tandoori Roti', image: '' }, quantity: 2 },
    ],
    status: 'completed',
    total: 425.00,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'order-004',
    tableNumber: 'Table 10',
    customerName: 'Emma Wilson',
    items: [
      { id: 'item-8', menuItem: { name: 'Malai Kofta', image: '' }, quantity: 1 },
      { id: 'item-9', menuItem: { name: 'Pulao Rice', image: '' }, quantity: 1 },
    ],
    status: 'completed',
    total: 350.00,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
];

export const useStaffOrders = () => {
  const [activeOrders, setActiveOrders] = useState(mockActiveOrders);
  const [completedOrders, setCompletedOrders] = useState(mockCompletedOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  
  // Function to fetch orders from the server
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, fetch orders from the API
      // For now, use mock data
      setActiveOrders(mockActiveOrders);
      setCompletedOrders(mockCompletedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for order updates
    const channel = supabase
      .channel('staff-order-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
        },
        (payload) => {
          console.log('Order update received:', payload);
          
          // In a real implementation, update the orders lists
          // For now, just show notifications
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Order',
              description: `New order #${payload.new.id.substring(0, 8)} has been received.`,
              variant: 'default',
            });
            
            // Add the new order to the active orders list
            fetchOrders();
          } else if (payload.eventType === 'UPDATE') {
            const oldStatus = payload.old.status;
            const newStatus = payload.new.status;
            
            if (oldStatus !== newStatus) {
              toast({
                title: 'Order Status Updated',
                description: `Order #${payload.new.id.substring(0, 8)} is now ${newStatus}.`,
              });
              
              // Update the orders in the lists
              fetchOrders();
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected');
        } else if (status === 'CHANNEL_ERROR') {
          setRealtimeStatus('error');
        } else {
          setRealtimeStatus('disconnected');
        }
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);
  
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, update the order status through the API
      const result = await updateOrderStatus(orderId, newStatus as any);
      
      if (result.success) {
        // Update the local order lists
        setActiveOrders(prev => 
          prev.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          ).filter(order => 
            newStatus !== 'completed' && newStatus !== 'served' && newStatus !== 'cancelled'
          )
        );
        
        if (newStatus === 'completed' || newStatus === 'served') {
          const orderToMove = activeOrders.find(order => order.id === orderId);
          if (orderToMove) {
            setCompletedOrders(prev => [{ ...orderToMove, status: newStatus }, ...prev]);
          }
        }
        
        toast({
          title: 'Order Updated',
          description: `Order #${orderId} status changed to ${newStatus}.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to update order status.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    activeOrders,
    completedOrders,
    isLoading,
    handleUpdateStatus,
    realtimeStatus
  };
};
