
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type StaffRole = 'Waiter' | 'Chef' | 'Manager';
type NotificationType = 'message' | 'order' | 'system' | 'payment';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: Date;
  read: boolean;
}

interface UseRealtimeNotificationsOptions {
  userId: string;
  role: StaffRole;
  restaurantId: string;
}

export const useRealtimeNotifications = ({
  userId,
  role
}: UseRealtimeNotificationsOptions) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, you would connect to Supabase Realtime to get notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate demo notifications based on role
        const demoNotifications: Notification[] = [];
        
        // Common notifications for all roles
        demoNotifications.push({
          id: uuidv4(),
          type: 'system',
          message: 'New system update available. Check settings.',
          time: new Date(new Date().getTime() - 30 * 60000),
          read: true
        });
        
        demoNotifications.push({
          id: uuidv4(),
          type: 'message',
          message: 'Welcome back! Your shift starts in 1 hour.',
          time: new Date(new Date().getTime() - 2 * 60 * 60000),
          read: false
        });
        
        // Role-specific notifications
        if (role === 'Waiter') {
          demoNotifications.push({
            id: uuidv4(),
            type: 'order',
            message: 'New order ready for pickup at Table 7',
            time: new Date(new Date().getTime() - 5 * 60000),
            read: false
          });
          
          demoNotifications.push({
            id: uuidv4(),
            type: 'order',
            message: 'Customer at Table 4 requested assistance',
            time: new Date(new Date().getTime() - 15 * 60000),
            read: false
          });
        }
        
        if (role === 'Chef') {
          demoNotifications.push({
            id: uuidv4(),
            type: 'order',
            message: 'New order received: 2x Steak, 1x Pasta',
            time: new Date(new Date().getTime() - 7 * 60000),
            read: false
          });
          
          demoNotifications.push({
            id: uuidv4(),
            type: 'system',
            message: 'Inventory alert: Low on seafood items',
            time: new Date(new Date().getTime() - 120 * 60000),
            read: true
          });
        }
        
        if (role === 'Manager') {
          demoNotifications.push({
            id: uuidv4(),
            type: 'payment',
            message: 'Daily sales report ready for review',
            time: new Date(new Date().getTime() - 45 * 60000),
            read: false
          });
          
          demoNotifications.push({
            id: uuidv4(),
            type: 'message',
            message: 'Staff meeting scheduled for tomorrow at 9 AM',
            time: new Date(new Date().getTime() - 4 * 60 * 60000),
            read: true
          });
        }
        
        // Sort by time (newest first)
        demoNotifications.sort((a, b) => b.time.getTime() - a.time.getTime());
        
        setNotifications(demoNotifications);
        setUnreadCount(demoNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
    
    // In a real app, you would subscribe to Supabase Realtime here
    // and clean up the subscription when the component unmounts
    
    return () => {
      // Cleanup realtime subscription in a real app
    };
  }, [userId, role]);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // In a real app, you would update the database here
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    setUnreadCount(0);
    
    // In a real app, you would update the database here
  };
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading
  };
};
