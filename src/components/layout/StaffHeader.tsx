
import React, { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import NotificationsPopover from '@/components/staff/NotificationsPopover';
import { useRealtimeNotifications } from '@/hooks/notifications';
import { useAuth } from '@/contexts/AuthContext';

interface StaffHeaderProps {
  onMenuButtonClick?: () => void;
}

const StaffHeader = ({ onMenuButtonClick }: StaffHeaderProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, userRoles } = useAuth();
  
  // Get user information from authentication context
  const staffName = user?.user_metadata?.full_name || "Staff User";
  const staffRole = userRoles.includes('chef') ? "Chef" : 
                    userRoles.includes('waiter') ? "Waiter" : 
                    userRoles.includes('manager') ? "Manager" : "Staff";
  
  const staffId = user?.id || 'staff-id-123';
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';

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

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const staffInitials = getInitials(staffName);

  return (
    <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 bg-white shadow-sm">
      <div className="flex items-center">
        {/* Hamburger menu button with improved touch target */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onMenuButtonClick}
          className="mr-2 hover:bg-slate-100 -ml-2 h-10 w-10"
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
      
      <div className="flex items-center space-x-2 md:space-x-4">
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
            <AvatarFallback className="bg-orange-500 text-white">{staffInitials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default StaffHeader;
