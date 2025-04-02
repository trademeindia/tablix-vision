
export type NotificationType = 'order' | 'waiter_request' | 'kitchen' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  metadata?: Record<string, any>;
}

export interface UseRealtimeNotificationsProps {
  userId: string;
  role?: 'Waiter' | 'Chef' | 'Manager';
  tableId?: string;
  restaurantId: string;
  enabled?: boolean;
}

export interface UseRealtimeNotificationsReturn {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}
