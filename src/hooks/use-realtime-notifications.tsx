
// This file has been refactored, it now forwards requests to the new location
import { useRealtimeNotifications as useRealtimeNotificationsHook } from './notifications';

export const useRealtimeNotifications = useRealtimeNotificationsHook;
