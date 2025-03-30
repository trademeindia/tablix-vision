
import React from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrdersPage = () => {
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-slate-500">View and manage table orders</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Order management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </StaffDashboardLayout>
  );
};

export default OrdersPage;
