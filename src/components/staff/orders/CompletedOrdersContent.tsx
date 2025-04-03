
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DollarSign, User, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CompletedOrdersContentProps {
  orders: any[];
  isLoading: boolean;
}

const CompletedOrdersContent = ({ orders, isLoading }: CompletedOrdersContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-slate-500 text-center py-8">No completed orders yet.</p>
    );
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow">
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
                  <p className="text-xs text-slate-500">{order.items.length} items</p>
                  <span className="mx-2 text-slate-300">•</span>
                  <p className="text-xs font-medium flex items-center">
                    <DollarSign className="h-3 w-3 mr-0.5" />
                    {order.total.toFixed(2)}
                  </p>
                  <span className="mx-2 text-slate-300">•</span>
                  <p className="text-xs text-slate-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              
              <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
            </div>
            
            <div className="flex mt-2 overflow-x-auto gap-2 pb-2">
              {order.items.slice(0, 5).map((orderItem: any) => (
                <div key={orderItem.id} className="flex-shrink-0 w-16">
                  <div className="h-16 w-16 rounded bg-slate-100 overflow-hidden mb-1">
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
                  <p className="text-xs text-center truncate">{orderItem.quantity}x</p>
                </div>
              ))}
              {order.items.length > 5 && (
                <div className="flex-shrink-0 w-16 h-16 rounded bg-slate-50 flex items-center justify-center text-sm text-slate-500">
                  +{order.items.length - 5}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CompletedOrdersContent;
