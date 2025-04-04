
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Clock, Check, CheckCheck, CreditCard } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface ActiveOrdersContentProps {
  orders: any[];
  isLoading: boolean;
  handleUpdateStatus: (orderId: string, newStatus: string) => void;
}

const ActiveOrdersContent = ({ orders, isLoading, handleUpdateStatus }: ActiveOrdersContentProps) => {
  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-slate-500">No active orders at the moment.</p>
        <p className="text-sm text-slate-400 mt-2">New orders will appear here automatically.</p>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex flex-col p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow transition-colors">
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
            
            <div className="my-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {order.items.slice(0, 4).map((orderItem: any) => (
                <div key={orderItem.id} className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                    {orderItem.menuItem.image ? (
                      <img 
                        src={orderItem.menuItem.image} 
                        alt={orderItem.menuItem.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{orderItem.menuItem.name}</p>
                    <p className="text-xs text-slate-500">x{orderItem.quantity}</p>
                  </div>
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="flex items-center justify-center text-sm text-slate-500">
                  +{order.items.length - 4} more
                </div>
              )}
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
    </ScrollArea>
  );
};

export default ActiveOrdersContent;
