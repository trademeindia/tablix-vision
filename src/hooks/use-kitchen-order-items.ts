
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
  const toggleItemCompletion = useCallback((orderId: string, itemId: string) => {
    const updateOrderItems = (orders: KitchenOrder[]) => {
      return orders.map(order => {
        if (order.id === orderId) {
          const updatedItems = order.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                completed: !item.completed
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

    // In a real implementation, this would update the database
    // For demo purposes, we just show a success toast
    toast({
      title: 'Item updated',
      description: 'Food preparation status updated successfully',
    });
    
    // Log the update - this would be a database call in production
    console.log(`Updated item ${itemId} in order ${orderId}`);
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
      // Update local state first for immediate UI feedback
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

      // In a real implementation, this would update the database
      toast({
        title: 'Order updated',
        description: `Order status changed to ${newStatus}`,
      });
      
      // In a production app, we would make a Supabase call here
      console.log(`Updated order ${orderId} status to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  }, [pendingOrders]);

  // Set up real-time subscription
  useEffect(() => {
    fetchOrders();
    
    // Set up Supabase real-time subscription
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: "status=in.(pending,preparing)"
        },
        (payload) => {
          console.log('Order update received:', payload);
          fetchOrders(); // Refresh all orders when we get an update
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
