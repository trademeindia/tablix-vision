
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StaffOrdersHeaderProps {
  realtimeStatus?: 'connected' | 'disconnected' | 'error';
}

const StaffOrdersHeader = ({ realtimeStatus }: StaffOrdersHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Process and manage customer orders.</p>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center mr-2">
                {realtimeStatus === 'connected' ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                <span className="ml-1 text-sm">
                  {realtimeStatus === 'connected' ? 'Live Updates On' : 'Live Updates Off'}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {realtimeStatus === 'connected'
                  ? 'Real-time updates are active. You will see new orders instantly.'
                  : 'Real-time updates are not available. Refresh to see new orders.'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default StaffOrdersHeader;
