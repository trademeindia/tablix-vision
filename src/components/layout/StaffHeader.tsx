import React, { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
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
      {isMobile ? (
        // Mobile header with drawer
        <div className="flex items-center justify-between w-full">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80vh]">
              <div className="p-4 pt-0">
                <div className="flex justify-between items-center mb-4 mt-8 border-b pb-4">
                  <h2 className="text-xl font-bold">StaffPortal</h2>
                </div>
                <div className="flex items-center mb-6 p-3 bg-slate-100 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <span className="text-white font-medium">JS</span>
                  </div>
                  <div>
                    <p className="font-medium">{staffName}</p>
                    <p className="text-sm text-slate-500">{staffRole}</p>
                  </div>
                </div>
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Button 
                      key={item.path}
                      variant="ghost" 
                      className="justify-start h-12 text-base" 
                      onClick={() => {
                        navigate(item.path);
                        setIsDrawerOpen(false);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </div>
            </DrawerContent>
          </Drawer>

          <h2 className="text-lg font-medium truncate">
            Welcome, {staffName}
            <span className="text-xs ml-1 text-slate-500">({staffRole})</span>
          </h2>
          
          <div className="flex items-center">
            <NotificationsPopover
              notifications={notifications}
              unreadCount={unreadCount}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
              isLoading={isLoading}
            />
          </div>
        </div>
      ) : (
        // Desktop header
        <>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuButtonClick}
              className="mr-2 lg:hidden"
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
            />
            
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-orange-500 text-white">JS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffHeader;
