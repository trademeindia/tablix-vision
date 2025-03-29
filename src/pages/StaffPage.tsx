
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StaffPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <p className="text-slate-500">Manage your restaurant staff</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">This page will be populated with staff management functionality.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StaffPage;
