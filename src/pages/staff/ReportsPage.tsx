
import React from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { useAnalytics } from '@/hooks/use-analytics';
import RevenueStats from '@/components/analytics/RevenueStats';
import OrderStats from '@/components/analytics/OrderStats';
import PopularItems from '@/components/analytics/PopularItems';
import SalesChart from '@/components/analytics/SalesChart';

const ReportsPage = () => {
  // In a real application, you would get this from auth or context
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder restaurant ID
  
  const {
    revenueData,
    orderCounts,
    popularItems,
    popularItemsLoading,
    salesData,
    salesDataLoading
  } = useAnalytics(restaurantId);

  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-slate-500">View restaurant performance metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RevenueStats
          weeklyRevenue={revenueData.week}
          monthlyRevenue={revenueData.month}
          yearlyRevenue={revenueData.year}
          isLoading={revenueData.isLoading}
        />
        
        <OrderStats
          weeklyOrders={orderCounts.week}
          monthlyOrders={orderCounts.month}
          yearlyOrders={orderCounts.year}
          isLoading={orderCounts.isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <PopularItems 
            items={popularItems} 
            isLoading={popularItemsLoading} 
          />
        </div>
        
        <div className="lg:col-span-2">
          <SalesChart 
            data={salesData} 
            isLoading={salesDataLoading} 
          />
        </div>
      </div>
    </StaffDashboardLayout>
  );
};

export default ReportsPage;
