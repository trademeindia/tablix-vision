
import React from 'react';
import { Bell } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';

const StaffHeader = () => {
  // In a real app, you would fetch the staff name from authentication context
  const staffName = "Jane Smith";
  const staffRole = "Waiter"; // This would come from your user authentication

  return (
    <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
      <div className="flex-1">
        <h2 className="text-lg font-medium">
          Welcome, {staffName} <span className="text-sm text-slate-500">({staffRole})</span>
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-slate-100">
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
