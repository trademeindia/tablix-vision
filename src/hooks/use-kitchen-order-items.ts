import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { OrderItem as SupabaseOrderItem } from '@/services/order/types';

export interface OrderItem {
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
  items: OrderItem[];
  status: string;
  total: number;
  createdAt: string;
}

export function useKitchenOrderItems() {
  const [pendingOrders, setPendingOrders] = useState<KitchenOrder[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<KitchenOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const restaurantId = "mock-restaurant-id";

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

            const items: OrderItem[] = (order.order_items || []).map((item: any) => ({
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

        const pendingOrdersData = transformedOrders.filter(order => order.status === 'pending');
        const preparingOrdersData = transformedOrders.filter(order => order.status === 'preparing');
        
        setPendingOrders(pendingOrdersData);
        setPreparingOrders(preparingOrdersData);
      } else {
        const mockActiveOrders = generateMockActiveOrders();
        
        const pendingOrdersData = mockActiveOrders.filter(order => order.status === 'pending');
        const preparingOrdersData = mockActiveOrders.filter(order => order.status === 'preparing');
        
        setPendingOrders(pendingOrdersData);
        setPreparingOrders(preparingOrdersData);
      }
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch kitchen orders',
        variant: 'destructive',
      });
      
      const mockActiveOrders = generateMockActiveOrders();
      const pendingOrdersData = mockActiveOrders.filter(order => order.status === 'pending');
      const preparingOrdersData = mockActiveOrders.filter(order => order.status === 'preparing');
      
      setPendingOrders(pendingOrdersData);
      setPreparingOrders(preparingOrdersData);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

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
      
      const { error } = await supabase
        .from('order_items')
        .update({ completed: newCompletedStatus })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating item status:', error);
        toast({
          title: 'Error',
          description: 'Failed to update item status',
          variant: 'destructive',
        });
        return;
      }

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

      toast({
        title: 'Item Updated',
        description: newCompletedStatus ? 'Item marked as prepared' : 'Item marked as not prepared',
      });
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }, []);

  const areAllItemsCompleted = useCallback((orderId: string) => {
    const order = [...preparingOrders, ...pendingOrders].find(o => o.id === orderId);
    if (!order) return false;
    
    return order.items.every(item => item.completed);
  }, [preparingOrders, pendingOrders]);

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
        return;
      }

      if (newStatus === 'preparing') {
        const orderToMove = pendingOrders.find(order => order.id === orderId);
        if (orderToMove) {
          setPendingOrders(prev => prev.filter(order => order.id !== orderId));
          setPreparingOrders(prev => [...prev, { ...orderToMove, status: newStatus }]);
        }
      } else if (newStatus === 'ready') {
        setPreparingOrders(prev => prev.filter(order => order.id !== orderId));
      }

      toast({
        title: 'Order Updated',
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }, [pendingOrders]);

  useEffect(() => {
    fetchOrders();
    
    const orderItemsChannel = supabase
      .channel('kitchen-order-items')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'order_items',
        },
        (payload) => {
          console.log('Order item update received:', payload);
          
          fetchOrders();
          
          if (payload.new && 'completed' in payload.new && payload.new.completed) {
            toast({
              title: 'Item Prepared',
              description: 'An order item has been marked as prepared',
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    const ordersChannel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `status=in.(pending,preparing,ready)`
        },
        (payload) => {
          console.log('Order update received:', payload);
          
          if (payload.old && payload.new && payload.old.status !== payload.new.status) {
            fetchOrders();
            
            toast({
              title: 'Order Status Changed',
              description: `Order status updated to ${payload.new.status}`,
            });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(orderItemsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [fetchOrders]);

  return {
    pendingOrders,
    preparingOrders,
    isLoading,
    isSubscribed,
    toggleItemCompletion,
    updateOrderStatus,
    areAllItemsCompleted
  };
}

function generateMockActiveOrders(): KitchenOrder[] {
  return [
    {
      id: "1a2b3c4d",
      tableNumber: "Table 12",
      customerName: "Alex Johnson",
      items: [
        { id: "i1", menuItem: { name: "Chicken Curry", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200" }, quantity: 2, completed: false },
        { id: "i2", menuItem: { name: "Garlic Naan", image: "https://images.unsplash.com/photo-1584736286279-5d85e6b408af?q=80&w=200" }, quantity: 4, completed: false },
        { id: "i3", menuItem: { name: "Mango Lassi", image: "https://images.unsplash.com/photo-1605262454594-af23eb782f31?q=80&w=200" }, quantity: 2, completed: false }
      ],
      total: 42.50,
      status: "pending",
      createdAt: new Date().toISOString()
    },
    {
      id: "2e3f4g5h",
      tableNumber: "Table 5",
      customerName: "Maria Garcia",
      items: [
        { id: "i4", menuItem: { name: "Margherita Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200" }, quantity: 1, completed: false },
        { id: "i5", menuItem: { name: "Caesar Salad", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=200" }, quantity: 1, completed: false }
      ],
      total: 24.99,
      status: "preparing",
      createdAt: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
      id: "3i4j5k6l",
      tableNumber: "Table 8",
      customerName: "James Wilson",
      items: [
        { id: "i6", menuItem: { name: "Beef Burger", image: "https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=200" }, quantity: 2, completed: false },
        { id: "i7", menuItem: { name: "French Fries", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=200" }, quantity: 1, completed: false },
        { id: "i8", menuItem: { name: "Chocolate Milkshake", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=200" }, quantity: 2, completed: false }
      ],
      total: 36.75,
      status: "preparing",
      createdAt: new Date(Date.now() - 25 * 60000).toISOString()
    }
  ];
}
