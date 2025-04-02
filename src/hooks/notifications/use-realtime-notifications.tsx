
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Notification, 
  UseRealtimeNotificationsProps, 
  UseRealtimeNotificationsReturn
} from './types';
import { 
  createOrderNotification, 
  createWaiterRequestNotification, 
  playNotificationSound, 
  showNotificationToast,
  generateMockNotifications
} from './notification-utils';

export const useRealtimeNotifications = ({
  userId,
  role,
  tableId,
  restaurantId,
  enabled = true
}: UseRealtimeNotificationsProps): UseRealtimeNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch existing notifications
  useEffect(() => {
    if (!enabled || !userId) return;

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        // This is a mock implementation - in a real app, fetch from Supabase
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample data
        const mockNotifications = generateMockNotifications();
        
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, enabled]);

  // Set up Supabase realtime subscription
  useEffect(() => {
    if (!enabled || !userId || !restaurantId) return;

    // Define which tables to subscribe to based on role
    const tableSubscriptions = [];
    
    if (role === 'Waiter' || role === 'Manager') {
      tableSubscriptions.push('waiter_requests');
      tableSubscriptions.push('orders');
    }
    
    if (role === 'Chef' || role === 'Manager') {
      tableSubscriptions.push('orders');
    }
    
    // Subscribe to each table
    const channel = supabase.channel('staff-notifications');
    
    // Set up subscriptions for each table
    if (tableSubscriptions.includes('orders')) {
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => handleNewOrder(payload.new)
      );
    }
    
    if (tableSubscriptions.includes('waiter_requests')) {
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'waiter_requests',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => handleWaiterRequest(payload.new)
      );
    }
    
    // Subscribe to the channel
    const subscription = channel.subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role, restaurantId, enabled]);

  // Handle new order notifications
  const handleNewOrder = (order: any) => {
    const newNotification = createOrderNotification(order);
    
    // Play notification sound
    playNotificationSound();
    
    // Add to notifications state
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification
    showNotificationToast(newNotification);
  };

  // Handle waiter request notifications
  const handleWaiterRequest = (request: any) => {
    const newNotification = createWaiterRequestNotification(request);
    
    // Play notification sound
    playNotificationSound();
    
    // Add to notifications state
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification
    showNotificationToast(newNotification);
  };

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // In a real app, you'd also update the database
    // await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('id', notificationId);
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    setUnreadCount(0);
    
    // In a real app, update the database
    // await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('user_id', userId);
  };

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
};
