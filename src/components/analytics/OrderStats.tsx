
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderStatsProps {
  weeklyOrders: number;
  monthlyOrders: number;
  yearlyOrders: number;
  isLoading: boolean;
}

const OrderStats = ({
  weeklyOrders,
  monthlyOrders,
  yearlyOrders,
  isLoading
}: OrderStatsProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <CardTitle className="text-xl mb-4">Orders</CardTitle>
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
                <p className="text-3xl font-bold">{weeklyOrders}</p>
                <p className="text-sm text-slate-500">orders in last 7 days</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="month">
            {isLoading ? (
              <Skeleton className="h-12 w-32" />
            ) : (
              <div>
                <p className="text-3xl font-bold">{monthlyOrders}</p>
                <p className="text-sm text-slate-500">orders in last 30 days</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="year">
            {isLoading ? (
              <Skeleton className="h-12 w-32" />
            ) : (
              <div>
                <p className="text-3xl font-bold">{yearlyOrders}</p>
                <p className="text-sm text-slate-500">orders in last 365 days</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderStats;
