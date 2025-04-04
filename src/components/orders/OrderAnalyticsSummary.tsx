
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useOrderCounts } from '@/hooks/analytics/use-orders';
import { useDemoOrderCounts } from '@/hooks/analytics/use-demo-order-counts';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, BarChart3, Clock, Package } from 'lucide-react';

interface OrderAnalyticsSummaryProps {
  restaurantId: string;
}

const OrderAnalyticsSummary = ({ restaurantId }: OrderAnalyticsSummaryProps) => {
  // Use demo data instead of real API
  const { today, week, month, pending, isLoading } = useDemoOrderCounts();

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </>
    );
  }

  return (
    <>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Today's Orders</p>
              <p className="text-3xl font-bold">{today}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-5 w-5 text-blue-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Weekly Orders</p>
              <p className="text-3xl font-bold">{week}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BarChart3 className="h-5 w-5 text-green-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending Orders</p>
              <p className="text-3xl font-bold">{pending}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Clock className="h-5 w-5 text-amber-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OrderAnalyticsSummary;
