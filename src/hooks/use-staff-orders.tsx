import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { updateOrderStatus } from '@/services/order';

export function useStaffOrders() {
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  
  // Fetch orders
  useEffect(() => {
    fetchOrders();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('staff-orders')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders'
        },
        (payload) => {
          console.log('Order change detected:', payload);
          fetchOrders();
          
          // Show notification for new orders
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Order",
              description: "A new order has been placed",
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected');
        } else {
          setRealtimeStatus('disconnected');
        }
      });
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchOrders = async () => {
    setIsLoading(true);
    
    // In a real app, we'd fetch from Supabase
    // For demo purposes, we'll use mock data
    
    // Active orders - pending, preparing, ready
    const mockActiveOrders = generateMockActiveOrders();
    
    // Completed orders - served, completed
    const mockCompletedOrders = generateMockCompletedOrders();
    
    setActiveOrders(mockActiveOrders);
    setCompletedOrders(mockCompletedOrders);
    setIsLoading(false);
  };
  
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // In a real app, we'd update the status in Supabase
      // For demo purposes, we'll just update the state
      
      // Find the order in activeOrders
      const orderToUpdate = activeOrders.find(order => order.id === orderId);
      
      if (!orderToUpdate) {
        toast({
          title: "Error",
          description: "Order not found",
          variant: "destructive",
        });
        return;
      }
      
      // Update the order status
      const updatedOrder = { ...orderToUpdate, status: newStatus };
      
      // Remove the order from activeOrders
      const newActiveOrders = activeOrders.filter(order => order.id !== orderId);
      
      // If the order is now completed or served, add it to completedOrders
      if (newStatus === 'completed' || newStatus === 'served') {
        setCompletedOrders(prev => [updatedOrder, ...prev]);
      } else {
        // Otherwise, add it back to activeOrders
        setActiveOrders(prev => [updatedOrder, ...newActiveOrders]);
      }
      
      // Update the UI immediately
      toast({
        title: "Order Updated",
        description: `Order #${orderId.substring(0, 8)} status updated to ${newStatus}`,
      });
      
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  return { 
    activeOrders, 
    completedOrders, 
    isLoading, 
    handleUpdateStatus,
    realtimeStatus
  };
}

// Mock data generator functions
function generateMockActiveOrders() {
  return [
    {
      id: "1a2b3c4d",
      tableNumber: "Table 12",
      customerName: "Alex Johnson",
      items: [
        { id: "i1", menuItem: { name: "Chicken Curry", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200" }, quantity: 2 },
        { id: "i2", menuItem: { name: "Garlic Naan", image: "https://images.unsplash.com/photo-1584736286279-5d85e6b408af?q=80&w=200" }, quantity: 4 },
        { id: "i3", menuItem: { name: "Mango Lassi", image: "https://images.unsplash.com/photo-1605262454594-af23eb782f31?q=80&w=200" }, quantity: 2 }
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
        { id: "i4", menuItem: { name: "Margherita Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200" }, quantity: 1 },
        { id: "i5", menuItem: { name: "Caesar Salad", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=200" }, quantity: 1 }
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
        { id: "i6", menuItem: { name: "Beef Burger", image: "https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=200" }, quantity: 2 },
        { id: "i7", menuItem: { name: "French Fries", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=200" }, quantity: 1 },
        { id: "i8", menuItem: { name: "Chocolate Milkshake", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=200" }, quantity: 2 }
      ],
      total: 36.75,
      status: "ready",
      createdAt: new Date(Date.now() - 25 * 60000).toISOString() // 25 minutes ago
    }
  ];
}

function generateMockCompletedOrders() {
  return [
    {
      id: "4m5n6o7p",
      tableNumber: "Table 3",
      customerName: "Emily Brown",
      items: [
        { id: "i9", menuItem: { name: "Pasta Carbonara", image: "https://images.unsplash.com/photo-1608756687911-aa1599ab5564?q=80&w=200" }, quantity: 1 },
        { id: "i10", menuItem: { name: "Tiramisu", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=200" }, quantity: 1 }
      ],
      total: 27.50,
      status: "completed",
      createdAt: new Date(Date.now() - 60 * 60000).toISOString() // 1 hour ago
    },
    {
      id: "5q6r7s8t",
      tableNumber: "Table 10",
      customerName: "Robert Martinez",
      items: [
        { id: "i11", menuItem: { name: "Sushi Platter", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=200" }, quantity: 1 },
        { id: "i12", menuItem: { name: "Miso Soup", image: "https://images.unsplash.com/photo-1607301618642-06a4e65f3de4?q=80&w=200" }, quantity: 2 },
        { id: "i13", menuItem: { name: "Green Tea", image: "https://images.unsplash.com/photo-1556682851-c4580e60025f?q=80&w=200" }, quantity: 2 }
      ],
      total: 52.25,
      status: "served",
      createdAt: new Date(Date.now() - 90 * 60000).toISOString() // 1.5 hours ago
    }
  ];
}
