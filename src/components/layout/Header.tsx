
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

const Header = () => {
  return (
    <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
      <div className="flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Search..." 
            className="pl-8 bg-slate-50 border-slate-200 w-full max-w-md"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-orange-500 text-white">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Header;
