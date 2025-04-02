
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import PopularItems from '@/components/dashboard/PopularItems';
import { 
  ShoppingCart, Users, Utensils, IndianRupee, 
  Calendar, ArrowUpRight, TrendingUp, CreditCard 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import SalesChart from '@/components/analytics/SalesChart';
import { useAnalytics } from '@/hooks/use-analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  // Add logging to track component render
  useEffect(() => {
    console.log("Index page rendered");
  }, []);

  // In a real application, you would get this from auth or context
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder restaurant ID
  
  const {
    salesData,
    salesDataLoading,
    popularItems
  } = useAnalytics(restaurantId);

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

  // Sample metrics data for different time periods
  const metricsData = {
    daily: {
      revenue: '₹12,458.32',
      orders: 42,
      tables: `${tables.filter(t => t.occupied).length}/${tables.length}`,
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
    <DashboardLayout>
      <PageTransition>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-base text-slate-500">Welcome back! Here's an overview of your restaurant.</p>
        </div>
        
        {/* KPI Cards with Time Period Tabs */}
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <StatsCard 
                title="Today's Revenue"
                value={metricsData.daily.revenue}
                icon={<IndianRupee className="h-5 w-5 text-green-600" />}
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard 
                title="Today's Orders"
                value={metricsData.daily.orders}
                icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
                trend={{ value: 8, isPositive: true }}
              />
              <StatsCard 
                title="Active Tables"
                value={metricsData.daily.tables}
                icon={<CreditCard className="h-5 w-5 text-purple-600" />}
              />
              <StatsCard 
                title="New Customers"
                value={metricsData.daily.newCustomers}
                icon={<Users className="h-5 w-5 text-orange-600" />}
                trend={{ value: 24, isPositive: true }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <StatsCard 
                title="Weekly Revenue"
                value={metricsData.weekly.revenue}
                icon={<IndianRupee className="h-5 w-5 text-green-600" />}
                trend={{ value: 8, isPositive: true }}
              />
              <StatsCard 
                title="Weekly Orders"
                value={metricsData.weekly.orders}
                icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
                trend={{ value: 5, isPositive: true }}
              />
              <StatsCard 
                title="Tables Utilized"
                value={metricsData.weekly.tables}
                icon={<CreditCard className="h-5 w-5 text-purple-600" />}
              />
              <StatsCard 
                title="New Customers"
                value={metricsData.weekly.newCustomers}
                icon={<Users className="h-5 w-5 text-orange-600" />}
                trend={{ value: 15, isPositive: true }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="monthly">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <StatsCard 
                title="Monthly Revenue"
                value={metricsData.monthly.revenue}
                icon={<IndianRupee className="h-5 w-5 text-green-600" />}
                trend={{ value: 18, isPositive: true }}
              />
              <StatsCard 
                title="Monthly Orders"
                value={metricsData.monthly.orders}
                icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard 
                title="Tables Utilized"
                value={metricsData.monthly.tables}
                icon={<CreditCard className="h-5 w-5 text-purple-600" />}
              />
              <StatsCard 
                title="New Customers"
                value={metricsData.monthly.newCustomers}
                icon={<Users className="h-5 w-5 text-orange-600" />}
                trend={{ value: 30, isPositive: true }}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Charts and Data Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">Revenue Trend</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Calendar className="mr-2 h-4 w-4" />
                    This Month
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SalesChart 
                  data={salesData} 
                  isLoading={salesDataLoading}
                  height={250}
                  currency="₹"
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <PopularItems />
          </div>
        </div>
        
        {/* Recent Orders and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Table Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {tables.map(table => (
                    <div 
                      key={table.id} 
                      className={`flex items-center justify-center h-14 rounded-lg border ${
                        table.occupied 
                          ? 'bg-blue-600 text-white border-blue-700' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm font-medium">{table.number}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-md font-medium">Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">New Customers</p>
                      <p className="text-2xl font-bold">38%</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Returning Customers</p>
                      <p className="text-2xl font-bold">62%</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Index;
