
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Clock, Check, CheckCheck, CreditCard } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

interface ActiveOrdersContentProps {
  orders: any[];
  isLoading: boolean;
  handleUpdateStatus: (orderId: string, newStatus: string) => void;
}

const ActiveOrdersContent = ({ orders, isLoading, handleUpdateStatus }: ActiveOrdersContentProps) => {
  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No active orders at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex flex-col p-4 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center">
                <p className="font-medium">{order.tableNumber}</p>
                <span className="mx-2 text-slate-300">•</span>
                <p className="text-sm text-slate-500 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {order.customerName}
                </p>
              </div>
              <div className="flex items-center mt-1">
                <p className="text-sm text-slate-500">{order.items.length} items</p>
                <span className="mx-2 text-slate-300">•</span>
                <p className="text-sm font-medium">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <OrderStatusBadge status={order.status} />
              <p className="text-xs text-slate-400 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2">
            {order.status === 'pending' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center"
                onClick={() => handleUpdateStatus(order.id, 'preparing')}
              >
                <Check className="h-3 w-3 mr-1" />
                Start Preparing
              </Button>
            )}
            
            {order.status === 'preparing' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center"
                onClick={() => handleUpdateStatus(order.id, 'ready')}
              >
                <Check className="h-3 w-3 mr-1" />
                Mark as Ready
              </Button>
            )}
            
            {order.status === 'ready' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center"
                onClick={() => handleUpdateStatus(order.id, 'served')}
              >
                <Check className="h-3 w-3 mr-1" />
                Mark as Served
              </Button>
            )}
            
            {order.status === 'served' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => handleUpdateStatus(order.id, 'completed')}
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Complete Order
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center"
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  Process Payment
                </Button>
              </>
            )}
            
            <Button 
              size="sm" 
              variant="ghost" 
              className="ml-auto"
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveOrdersContent;
