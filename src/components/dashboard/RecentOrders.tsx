
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  table: number;
  items: number;
  total: string;
  status: 'pending' | 'preparing' | 'served' | 'completed';
  time: string;
}

const dummyOrders: Order[] = [
  { id: 'ORD-001', table: 4, items: 3, total: '$42.50', status: 'preparing', time: '2 min ago' },
  { id: 'ORD-002', table: 7, items: 1, total: '$18.90', status: 'pending', time: '5 min ago' },
  { id: 'ORD-003', table: 2, items: 5, total: '$76.20', status: 'served', time: '10 min ago' },
  { id: 'ORD-004', table: 9, items: 2, total: '$32.40', status: 'completed', time: '25 min ago' },
];

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
  served: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
};

const RecentOrders = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
              <div>
                <p className="font-medium">{order.id}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-slate-500">Table {order.table}</span>
                  <span className="text-sm text-slate-400 mx-2">•</span>
                  <span className="text-sm text-slate-500">{order.items} items</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="text-right mr-4">
                  <p className="font-medium">{order.total}</p>
                  <p className="text-sm text-slate-500">{order.time}</p>
                </div>
                
                <Badge className={cn("capitalize", statusStyles[order.status])}>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
