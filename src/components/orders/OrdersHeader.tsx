
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OrdersHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  realtimeStatus?: 'connected' | 'disconnected' | 'error';
}

const OrdersHeader = ({ isRefreshing, onRefresh, realtimeStatus }: OrdersHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage your restaurant orders here.</p>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center mr-2">
                {realtimeStatus === 'connected' ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="ml-1 text-xs text-muted-foreground">
                  {realtimeStatus === 'connected' ? 'Live' : 'Offline'}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {realtimeStatus === 'connected'
                  ? 'Real-time updates are active'
                  : 'Real-time updates are not available'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button size="sm" asChild>
          <Link to="/orders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrdersHeader;
