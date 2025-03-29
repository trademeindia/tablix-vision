
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StaffDashboardPage = () => {
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <p className="text-slate-500">Welcome to your staff dashboard</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Your tasks and notifications will appear here based on your role.</p>
        </CardContent>
      </Card>
    </StaffDashboardLayout>
  );
};

export default StaffDashboardPage;
