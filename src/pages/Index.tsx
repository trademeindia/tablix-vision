
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import PopularItems from '@/components/dashboard/PopularItems';
import { ShoppingCart, Users, Utensils, DollarSign } from 'lucide-react';
import PageTransition from '@/components/ui/page-transition';

const Index = () => {
  // Add logging to track component render
  useEffect(() => {
    console.log("Index page rendered");
  }, []);

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-base text-slate-500">Welcome back! Here's an overview of your restaurant</p>
        </div>
        
        {/* Adjusted grid for better mobile display */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
          <StatsCard 
            title="Today's Orders"
            value={42}
            icon={<ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard 
            title="Total Customers"
            value={248}
            icon={<Users className="h-4 w-4 md:h-5 md:w-5 text-green-600" />}
            trend={{ value: 18, isPositive: true }}
          />
          <StatsCard 
            title="Menu Items"
            value={64}
            icon={<Utensils className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />}
          />
          <StatsCard 
            title="Revenue Today"
            value="$1,248.42"
            icon={<DollarSign className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />}
            trend={{ value: 8, isPositive: true }}
          />
        </div>
        
        {/* Adjusted grid for better mobile display */}
        <div className="grid grid-cols-1 gap-3 md:gap-6">
          <div className="w-full">
            <RecentOrders />
          </div>
          <div className="w-full">
            <PopularItems />
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Index;
