
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/format';

interface RevenueStatsProps {
  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  isLoading: boolean;
  currency?: string;
}

const RevenueStats: React.FC<RevenueStatsProps> = ({
  weeklyRevenue,
  monthlyRevenue,
  yearlyRevenue,
  isLoading,
  currency = 'INR'
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <CardTitle className="text-xl mb-4">Revenue</CardTitle>
        <Tabs defaultValue="week">
          <TabsList className="mb-4">
            <TabsTrigger value="week">Last 7 days</TabsTrigger>
            <TabsTrigger value="month">Last 30 days</TabsTrigger>
            <TabsTrigger value="year">Last 365 days</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week">
            {isLoading ? (
              <Skeleton className="h-12 w-32" />
            ) : (
              <div>
                <p className="text-3xl font-bold">{formatCurrency(weeklyRevenue)}</p>
                <p className="text-sm text-slate-500">Last 7 days total revenue</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="month">
            {isLoading ? (
              <Skeleton className="h-12 w-32" />
            ) : (
              <div>
                <p className="text-3xl font-bold">{formatCurrency(monthlyRevenue)}</p>
                <p className="text-sm text-slate-500">Last 30 days total revenue</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="year">
            {isLoading ? (
              <Skeleton className="h-12 w-32" />
            ) : (
              <div>
                <p className="text-3xl font-bold">{formatCurrency(yearlyRevenue)}</p>
                <p className="text-sm text-slate-500">Last 365 days total revenue</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RevenueStats;
