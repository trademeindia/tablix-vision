
import React from 'react';
import { useAnalytics } from '@/hooks/analytics';
import PerformanceMetricsTabs from './performance/PerformanceMetricsTabs';
import RevenueTrendCard from './charts/RevenueTrendCard';
import PopularItems from './PopularItems';
import RecentOrders from './RecentOrders';
import TableAvailability from './tables/TableAvailability';
import CustomerSegmentsCard from './customer/CustomerSegmentsCard';
import IntegrationsSection from './integrations/IntegrationsSection';

const DashboardContent = () => {
  // In a real application, you would get this from auth or context
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder restaurant ID
  
  // Sample table data for availability visualization
  const tables = [
    { id: 1, occupied: false, number: '101' },
    { id: 2, occupied: true, number: '102' },
    { id: 3, occupied: false, number: '103' },
    { id: 4, occupied: false, number: '104' },
    { id: 5, occupied: true, number: '105' },
    { id: 6, occupied: false, number: '106' },
    { id: 7, occupied: true, number: '107' },
    { id: 8, occupied: false, number: '108' },
    { id: 9, occupied: false, number: '109' },
    { id: 10, occupied: true, number: '110' },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm md:text-base text-slate-500">Welcome back! Here's an overview of your restaurant.</p>
      </div>
      
      {/* KPI Cards with Time Period Tabs */}
      <PerformanceMetricsTabs />
      
      {/* Charts and Data Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueTrendCard 
            restaurantId={restaurantId}
          />
        </div>
        <div className="lg:col-span-1">
          <PopularItems />
        </div>
      </div>
      
      {/* Integrations Section */}
      <div className="mb-6">
        <IntegrationsSection />
      </div>
      
      {/* Recent Orders and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div className="lg:col-span-1">
          <TableAvailability tables={tables} />
          
          <div className="mt-6">
            <CustomerSegmentsCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
