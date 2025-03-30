
import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface StaffHeaderProps {
  onMenuButtonClick?: () => void;
}

const StaffHeader = ({ onMenuButtonClick }: StaffHeaderProps) => {
  // In a real app, you would fetch the staff name from authentication context
  const staffName = "Jane Smith";
  const staffRole = "Waiter"; // This would come from your user authentication

  return (
    <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 bg-white">
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
        <button className="relative p-2 rounded-full hover:bg-slate-100" aria-label="Notifications">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>
        
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
