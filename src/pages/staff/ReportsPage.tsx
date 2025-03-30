
import React from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReportsPage = () => {
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-slate-500">View analytics and reports</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Reports and analytics functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </StaffDashboardLayout>
  );
};

export default ReportsPage;
