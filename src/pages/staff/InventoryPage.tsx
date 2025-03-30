
import React from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InventoryPage = () => {
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <p className="text-slate-500">Track and manage inventory</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Inventory management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </StaffDashboardLayout>
  );
};

export default InventoryPage;
