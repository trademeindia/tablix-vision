
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

  // Fetch kitchen orders
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // For now, use mock data - in production this would fetch from Supabase
      const mockActiveOrders = generateMockActiveOrders();
      
      // Filter orders based on status
      const pendingOrdersData = mockActiveOrders.filter(order => order.status === 'pending');
      const preparingOrdersData = mockActiveOrders.filter(order => order.status === 'preparing');
      
      setPendingOrders(pendingOrdersData);
      setPreparingOrders(preparingOrdersData);
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch kitchen orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle item completion status
  const toggleItemCompletion = useCallback(async (orderId: string, itemId: string) => {
    try {
      const { error } = await supabase
        .from('order_items')
        .update({ completed: true })
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

      // Optimistically update local state
      const updateOrderItems = (orders: KitchenOrder[]) => {
        return orders.map(order => {
          if (order.id === orderId) {
            const updatedItems = order.items.map(item => {
              if (item.id === itemId) {
                return {
                  ...item,
                  completed: true
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

      toast({
        title: 'Item Updated',
        description: 'Item marked as prepared',
      });
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }, []);

  // Check if all items in an order are completed
  const areAllItemsCompleted = useCallback((orderId: string) => {
    const order = [...preparingOrders, ...pendingOrders].find(o => o.id === orderId);
    if (!order) return false;
    
    return order.items.every(item => item.completed);
  }, [preparingOrders, pendingOrders]);

  // Update order status
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

      // Optimistically update local state
      if (newStatus === 'preparing') {
        // Move from pending to preparing
        const orderToMove = pendingOrders.find(order => order.id === orderId);
        if (orderToMove) {
          setPendingOrders(prev => prev.filter(order => order.id !== orderId));
          setPreparingOrders(prev => [...prev, { ...orderToMove, status: newStatus }]);
        }
      } else if (newStatus === 'ready') {
        // Remove from preparing
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

  // Set up real-time subscription
  useEffect(() => {
    fetchOrders();
    
    // Set up Supabase real-time subscription for order items
    const channel = supabase
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
          
          // Refetch orders to ensure data consistency
          fetchOrders();
          
          // Optional: Show toast for specific updates
          if (payload.new.completed) {
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
    
    return () => {
      supabase.removeChannel(channel);
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

// Mock data generator function
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
      createdAt: new Date(Date.now() - 15 * 60000).toISOString() // 15 minutes ago
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
      createdAt: new Date(Date.now() - 25 * 60000).toISOString() // 25 minutes ago
    }
  ];
}
