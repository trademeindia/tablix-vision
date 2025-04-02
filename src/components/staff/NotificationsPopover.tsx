
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Notification } from '@/hooks/notifications/types';

interface NotificationsPopoverProps {
  userId?: string;
  restaurantId?: string;
  // Include the notifications property in the interface
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ 
  unreadCount, 
  isLoading, 
  notifications, 
  markAsRead, 
  markAllAsRead,
  userId,
  restaurantId
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" side="bottom">
        <Tabs defaultValue="notifications" className="h-96">
          <TabsList className="border-b">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="alerts" disabled>Alerts</TabsTrigger>
          </TabsList>
          <TabsContent value="notifications" className="m-0 p-0">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold">
                  {isLoading ? 'Loading notifications...' : 'Recent Notifications'}
                </h2>
                <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={isLoading || unreadCount === 0}>
                  Mark all as read
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[300px]">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id}>
                    <div className="p-4 hover:bg-gray-100 cursor-pointer" onClick={() => {
                      markAsRead(notification.id);
                      setOpen(false);
                    }}>
                      <div className="text-sm font-medium">{notification.title}</div>
                      <div className="text-xs text-gray-500">{notification.message}</div>
                      <div className="text-xs text-gray-500">{notification.timestamp}</div>
                    </div>
                    <Separator />
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500">No notifications</div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="alerts">
            <div className="p-4 text-sm text-gray-500">No alerts yet.</div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
