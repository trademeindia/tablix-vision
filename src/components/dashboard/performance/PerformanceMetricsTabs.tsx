
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyMetrics from './DailyMetrics';
import WeeklyMetrics from './WeeklyMetrics';
import MonthlyMetrics from './MonthlyMetrics';

const PerformanceMetricsTabs = () => {
  // Sample metrics data for different time periods
  const metricsData = {
    daily: {
      revenue: '₹12,458.32',
      orders: 42,
      tables: '4/10',
      newCustomers: 18,
    },
    weekly: {
      revenue: '₹78,921.50',
      orders: 285,
      tables: '45/50',
      newCustomers: 76,
    },
    monthly: {
      revenue: '₹3,24,458.75',
      orders: 1258,
      tables: '48/50',
      newCustomers: 312,
    }
  };
  
  return (
    <Tabs defaultValue="daily" className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Performance Metrics</h2>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="daily">
        <DailyMetrics data={metricsData.daily} />
      </TabsContent>
      
      <TabsContent value="weekly">
        <WeeklyMetrics data={metricsData.weekly} />
      </TabsContent>
      
      <TabsContent value="monthly">
        <MonthlyMetrics data={metricsData.monthly} />
      </TabsContent>
    </Tabs>
  );
};

export default PerformanceMetricsTabs;
