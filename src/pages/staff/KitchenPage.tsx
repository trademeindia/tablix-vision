
import React from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const KitchenPage = () => {
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kitchen View</h1>
        <p className="text-slate-500">View and manage food preparation</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Orders in Preparation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Kitchen order management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </StaffDashboardLayout>
  );
};

export default KitchenPage;
