
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAnalytics } from '@/hooks/use-analytics';
import RevenueStats from '@/components/analytics/RevenueStats';
import OrderStats from '@/components/analytics/OrderStats';
import PopularItems from '@/components/analytics/PopularItems';
import SalesChart from '@/components/analytics/SalesChart';
import CustomerDemographics from '@/components/analytics/CustomerDemographics';
import AverageOrderValue from '@/components/analytics/AverageOrderValue';
import PeakHoursAnalysis from '@/components/analytics/PeakHoursAnalysis';
import AIAnalyticsReport from '@/components/analytics/AIAnalyticsReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DownloadIcon, RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AnalyticsPage = () => {
  // In a real application, you would get this from auth or context
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder restaurant ID
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    revenueData,
    orderCounts,
    popularItems,
    popularItemsLoading,
    salesData,
    salesDataLoading,
    demographicsData,
    demographicsLoading,
    avgOrderData,
    avgOrderLoading,
    peakHoursData,
    peakHoursLoading,
    generateReport
  } = useAnalytics(restaurantId);

  const handleExportData = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      // In a real app, this would generate a CSV/PDF
      alert('Analytics data exported successfully');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-slate-500">View insights and statistics for your restaurant</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value as 'week' | 'month' | 'year')}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 365 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExportData} disabled={isExporting}>
            {isExporting ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <DownloadIcon className="mr-2 h-4 w-4" />
            )}
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RevenueStats
          weeklyRevenue={revenueData.week}
          monthlyRevenue={revenueData.month}
          yearlyRevenue={revenueData.year}
          isLoading={revenueData.isLoading}
          currency="INR"
        />
        
        <OrderStats
          weeklyOrders={orderCounts.week}
          monthlyOrders={orderCounts.month}
          yearlyOrders={orderCounts.year}
          isLoading={orderCounts.isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="sales">Sales Trend</TabsTrigger>
              <TabsTrigger value="average">Avg. Order Value</TabsTrigger>
              <TabsTrigger value="peak">Peak Hours</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales">
              <SalesChart 
                data={salesData} 
                isLoading={salesDataLoading}
                currency="INR"
              />
            </TabsContent>
            
            <TabsContent value="average">
              <AverageOrderValue 
                data={avgOrderData}
                isLoading={avgOrderLoading}
                currency="INR"
              />
            </TabsContent>
            
            <TabsContent value="peak">
              <PeakHoursAnalysis 
                data={peakHoursData}
                isLoading={peakHoursLoading}
                currency="INR"
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <CustomerDemographics 
            data={demographicsData}
            isLoading={demographicsLoading}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <PopularItems 
            items={popularItems} 
            isLoading={popularItemsLoading} 
          />
        </div>
        
        <div className="lg:col-span-2">
          <AIAnalyticsReport 
            restaurantId={restaurantId}
            onGenerateReport={generateReport}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
