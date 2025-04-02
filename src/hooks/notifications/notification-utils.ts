
import { Notification } from './types';
import { toast } from '@/hooks/use-toast';

/**
 * Create a notification object for a new order
 */
export const createOrderNotification = (order: any): Notification => {
  return {
    id: `order-${order.id}`,
    type: 'order',
    title: 'New Order',
    message: `Table ${order.table_number} placed a new order`,
    timestamp: new Date().toISOString(),
    read: false,
    metadata: { orderId: order.id, tableNumber: order.table_number }
  };
};

/**
 * Create a notification object for a waiter request
 */
export const createWaiterRequestNotification = (request: any): Notification => {
  return {
    id: `request-${request.id}`,
    type: 'waiter_request',
    title: 'Waiter Requested',
    message: `Table ${request.table_number} requested assistance`,
    timestamp: new Date().toISOString(),
    read: false,
    metadata: { requestId: request.id, tableNumber: request.table_number }
  };
};

/**
 * Play a notification sound
 */
export const playNotificationSound = () => {
  const audio = new Audio('/notification.mp3');
  audio.play().catch(err => console.error('Error playing notification sound:', err));
};

/**
 * Show a toast notification
 */
export const showNotificationToast = (notification: Notification) => {
  toast({
    title: notification.title,
    description: notification.message,
    duration: 5000,
  });
};

/**
 * Generate mock notifications for testing
 */
export const generateMockNotifications = (): Notification[] => {
  return [
    {
      id: '1',
      type: 'order',
      title: 'New Order',
      message: 'Table 5 placed a new order',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      read: true
    },
    {
      id: '2',
      type: 'waiter_request',
      title: 'Waiter Requested',
      message: 'Table 3 requested assistance',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false
    }
  ];
};
