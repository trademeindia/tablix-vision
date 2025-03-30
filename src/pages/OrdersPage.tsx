
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentOrders from '@/components/dashboard/RecentOrders';

const OrdersPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-slate-500">View and manage restaurant orders</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <RecentOrders />
        
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500">Detailed order history will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
