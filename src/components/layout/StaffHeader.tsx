
import React, { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useNavigate } from 'react-router-dom';
import NotificationsPopover from '@/components/staff/NotificationsPopover';
import { useRealtimeNotifications } from '@/hooks/notifications';

interface StaffHeaderProps {
  onMenuButtonClick?: () => void;
}

const StaffHeader = ({ onMenuButtonClick }: StaffHeaderProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // In a real app, you would fetch the staff and restaurant info from authentication context
  const staffId = 'staff-id-123';
  const staffName = "Jane Smith";
  const staffRole = "Waiter"; // This would come from your user authentication
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';

  // Navigation items for the mobile drawer
  const navItems = [
    { label: "Dashboard", path: "/staff-dashboard" },
    { label: "Orders", path: "/staff-dashboard/orders" },
    { label: "Kitchen View", path: "/staff-dashboard/kitchen" },
    { label: "Inventory", path: "/staff-dashboard/inventory" },
    { label: "Reports", path: "/staff-dashboard/reports" },
  ];

  // Set up real-time notifications
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    isLoading 
  } = useRealtimeNotifications({
    userId: staffId,
    role: staffRole as any,
    restaurantId
  });

  return (
    <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 bg-white">
      <div className="flex items-center">
        {/* Always show menu button for toggling the sidebar */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMenuButtonClick}
          className="mr-2"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <h2 className="text-base md:text-lg font-medium truncate">
          <span className="hidden sm:inline">Welcome, </span>
          {staffName} 
          <span className="text-xs ml-1 text-slate-500">({staffRole})</span>
        </h2>
      </div>
      
      <div className="flex items-center space-x-3 md:space-x-4">
        <NotificationsPopover
          notifications={notifications}
          unreadCount={unreadCount}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          isLoading={isLoading}
          userId={staffId}
          restaurantId={restaurantId}
        />
        
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-orange-500 text-white">JS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default StaffHeader;
