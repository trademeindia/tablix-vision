
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';

interface CompletedOrdersContentProps {
  orders: any[];
  isLoading: boolean;
}

const CompletedOrdersContent = ({ orders, isLoading }: CompletedOrdersContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-slate-500 text-center py-8">No completed orders yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
          <div>
            <div className="flex items-center">
              <p className="font-medium">{order.tableNumber}</p>
              <span className="mx-2 text-slate-300">•</span>
              <p className="text-sm text-slate-500">{order.customerName}</p>
            </div>
            <div className="flex items-center mt-1">
              <p className="text-xs text-slate-500">{order.items.length} items</p>
              <span className="mx-2 text-slate-300">•</span>
              <p className="text-xs font-medium flex items-center">
                <DollarSign className="h-3 w-3 mr-0.5" />
                {order.total.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
            <p className="text-xs text-slate-400 mt-1">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompletedOrdersContent;
