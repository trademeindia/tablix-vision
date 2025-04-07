
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChefHat, Bell } from 'lucide-react';

const StaffDashboardPage = () => {
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <p className="text-slate-500">Welcome to your staff dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Orders</CardTitle>
            <CardDescription>Current orders requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">3</div>
            <Button variant="outline" size="sm" className="mt-4">
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Orders
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kitchen Status</CardTitle>
            <CardDescription>Orders being prepared</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">2</div>
            <Button variant="outline" size="sm" className="mt-4">
              <ChefHat className="mr-2 h-4 w-4" />
              Kitchen View
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>Recent alerts and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">5</div>
            <Button variant="outline" size="sm" className="mt-4">
              <Bell className="mr-2 h-4 w-4" />
              View All
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="border-b pb-2 border-slate-100">
              <p className="font-medium">Table 5 order placed</p>
              <p className="text-sm text-slate-500">2 minutes ago</p>
            </li>
            <li className="border-b pb-2 border-slate-100">
              <p className="font-medium">Waiter assistance requested</p>
              <p className="text-sm text-slate-500">15 minutes ago</p>
            </li>
            <li>
              <p className="font-medium">Table 3 payment completed</p>
              <p className="text-sm text-slate-500">34 minutes ago</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </StaffDashboardLayout>
  );
};

export default StaffDashboardPage;
