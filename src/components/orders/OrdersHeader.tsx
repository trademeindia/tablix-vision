
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface OrdersHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const OrdersHeader = ({ isRefreshing, onRefresh }: OrdersHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-slate-500">View and manage restaurant orders</p>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onRefresh} 
        disabled={isRefreshing}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default OrdersHeader;
