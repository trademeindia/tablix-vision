
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import PopularItems from '@/components/dashboard/PopularItems';
import { ShoppingCart, Users, Utensils, DollarSign } from 'lucide-react';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here's an overview of your restaurant</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Today's Orders"
          value={42}
          icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard 
          title="Total Customers"
          value={248}
          icon={<Users className="h-5 w-5 text-green-600" />}
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard 
          title="Menu Items"
          value={64}
          icon={<Utensils className="h-5 w-5 text-purple-600" />}
        />
        <StatsCard 
          title="Revenue Today"
          value="$1,248.42"
          icon={<DollarSign className="h-5 w-5 text-orange-600" />}
          trend={{ value: 8, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div>
          <PopularItems />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
