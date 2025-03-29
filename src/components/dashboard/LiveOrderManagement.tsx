
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  size: string;
  image: string;
  totalQueries: string;
  received: string;
  pending: string;
  cancelled: string;
  delivered: string;
}

const orderItems: OrderItem[] = [
  {
    id: '1',
    name: 'Sweet cheezy pizza for kids Meal',
    size: '(small)',
    price: '$10.00',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    totalQueries: '3654',
    received: '2369',
    pending: '36',
    cancelled: '12',
    delivered: '789'
  },
  {
    id: '2',
    name: 'Sweet cheezy pizza for kids Meal',
    size: '(small)',
    price: '$9.12',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    totalQueries: '4869',
    received: '3987',
    pending: '79',
    cancelled: '17',
    delivered: '396'
  }
];

const LiveOrderManagement = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Live Order Management</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-slate-500 flex items-center">
            Today <span className="ml-1">▼</span>
          </div>
          <div className="text-sm text-slate-500 flex items-center">
            View All <span className="ml-1">▼</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">Order Name</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-slate-600">Total Queries</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-slate-600">Order Received</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-slate-600">Pending</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-slate-600">Cancelled</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-slate-600">Delivered</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((order) => (
                <tr key={order.id} className="border-b border-slate-100">
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img 
                          src={order.image} 
                          alt={order.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{order.name} {order.size}</p>
                        <p className="text-orange-500 text-sm">{order.price}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 font-medium">{order.totalQueries}</td>
                  <td className="text-center py-3 px-2 font-medium">{order.received}</td>
                  <td className="text-center py-3 px-2 font-medium text-amber-500">{order.pending}</td>
                  <td className="text-center py-3 px-2 font-medium text-red-500">{order.cancelled}</td>
                  <td className="text-center py-3 px-2 font-medium text-green-500">{order.delivered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveOrderManagement;
