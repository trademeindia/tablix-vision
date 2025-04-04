
import React from 'react';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Bell, Check, User, DollarSign, ClipboardCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

type NotificationType = 'message' | 'order' | 'system' | 'payment';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: Date;
  read: boolean;
}

interface NotificationsPopoverProps {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
  userId: string;
  restaurantId: string;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  isLoading
}) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'order':
        return <ClipboardCheck className="h-4 w-4 text-green-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-8 text-xs"
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Mark all as read
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="py-6 text-center text-sm text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">
            No notifications
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${
                    !notification.read ? 'bg-slate-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div className="p-1.5 rounded-full bg-slate-100">
                        {getIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {format(notification.time, 'MMM dd, h:mm a')}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <Separator />
        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm justify-center"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
