
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { KitchenOrder } from './types';
import { generateMockActiveOrders } from './mock-data';

export function useKitchenDataFetcher(restaurantId: string) {
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id, 
          status, 
          created_at, 
          total_amount,
          customer_name,
          table_id,
          order_items (
            id, 
            name, 
            quantity, 
            price,
            completed,
            menu_item_id
          )
        `)
        .in('status', ['pending', 'preparing'])
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        const transformedOrders: KitchenOrder[] = await Promise.all(
          ordersData.map(async (order) => {
            let tableNumber = "Table unknown";
            if (order.table_id) {
              const { data: tableData } = await supabase
                .from('tables')
                .select('number')
                .eq('id', order.table_id)
                .single();
              
              if (tableData) {
                tableNumber = `Table ${tableData.number}`;
              }
            }

            const items = (order.order_items || []).map((item: any) => ({
              id: item.id,
              menuItem: {
                name: item.name,
                image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200'
              },
              quantity: item.quantity,
              completed: item.completed || false
            }));

            return {
              id: order.id,
              tableNumber,
              customerName: order.customer_name || "Guest",
              items,
              status: order.status,
              total: order.total_amount || 0,
              createdAt: order.created_at
            };
          })
        );

        return transformedOrders;
      } else {
        return generateMockActiveOrders();
      }
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch kitchen orders',
        variant: 'destructive',
      });
      
      return generateMockActiveOrders();
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  return {
    fetchOrders,
    isLoading
  };
}
