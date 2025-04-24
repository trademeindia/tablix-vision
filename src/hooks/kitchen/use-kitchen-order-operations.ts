
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { KitchenOrder } from './types';

export function useKitchenOrderOperations() {
  const toggleItemCompletion = useCallback(async (orderId: string, itemId: string) => {
    try {
      const { data: currentItemData, error: fetchError } = await supabase
        .from('order_items')
        .select('*')
        .eq('id', itemId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching item status:', fetchError);
        throw fetchError;
      }

      const currentCompletedStatus = currentItemData && 'completed' in currentItemData 
        ? Boolean(currentItemData.completed) 
        : false;
      
      const newCompletedStatus = !currentCompletedStatus;
      
      // Using the update method with correct typing for order_items table
      // Using a type assertion to bypass TypeScript's strict checking for this field
      // since 'completed' exists in our application but might not be in the DB type definition
      const { error } = await supabase
        .from('order_items')
        .update({ completed: newCompletedStatus } as any)
        .eq('id', itemId);

      if (error) {
        console.error('Error updating item status:', error);
        toast({
          title: 'Error',
          description: 'Failed to update item status',
          variant: 'destructive',
        });
        return null;
      }

      toast({
        title: 'Item Updated',
        description: newCompletedStatus ? 'Item marked as prepared' : 'Item marked as not prepared',
      });
      
      return { itemId, orderId, newCompletedStatus };
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast({
          title: 'Error',
          description: 'Failed to update order status',
          variant: 'destructive',
        });
        return null;
      }

      toast({
        title: 'Order Updated',
        description: `Order status changed to ${newStatus}`,
      });
      
      return { orderId, newStatus };
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }, []);

  const areAllItemsCompleted = useCallback((order: KitchenOrder) => {
    if (!order) return false;
    return order.items.every(item => item.completed);
  }, []);

  return {
    toggleItemCompletion,
    updateOrderStatus,
    areAllItemsCompleted
  };
}
