
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/services/order/types';
import { toast } from 'sonner';

export function useOrderStatus() {
  const [completedOrders, setCompletedOrders] = useState<string[]>([]);
  
  // Listen for order status changes in the database
  useEffect(() => {
    // Initially check for any completed orders
    const fetchCompletedOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, table_id, status')
          .eq('status', 'completed')
          .order('updated_at', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error('Error fetching completed orders:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Only use orders that have a table_id
          const orderIds = data
            .filter(order => order.table_id)
            .map(order => order.id);
            
          if (orderIds.length > 0) {
            setCompletedOrders(orderIds);
          }
        }
      } catch (err) {
        console.error('Error in fetchCompletedOrders:', err);
      }
    };
    
    fetchCompletedOrders();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('order-status-changes')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: 'status=eq.completed'
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          
          // Only use orders that have a table_id
          if (updatedOrder && updatedOrder.id && updatedOrder.table_number) {
            setCompletedOrders(prev => [...prev, updatedOrder.id as string]);
            
            toast.success('Order completed', {
              description: `Order #${updatedOrder.id.substring(0, 8)} has been marked as completed. Table ${updatedOrder.table_number} will be freed.`
            });
          }
        }
      )
      .subscribe();
      
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Clear completed orders after they've been processed
  const clearCompletedOrder = (orderId: string) => {
    setCompletedOrders(prev => prev.filter(id => id !== orderId));
  };
  
  return {
    completedOrders,
    clearCompletedOrder
  };
}
