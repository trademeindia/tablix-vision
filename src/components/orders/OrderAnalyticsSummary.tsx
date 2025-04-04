
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ShoppingCart, TrendingUp, Check, Clock } from 'lucide-react';
import { useOrderCounts } from '@/hooks/analytics/use-orders';
import { getRevenueData } from '@/services/analytics';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderAnalyticsSummaryProps {
  restaurantId: string;
}

const OrderAnalyticsSummary: React.FC<OrderAnalyticsSummaryProps> = ({ restaurantId }) => {
  const [revenueData, setRevenueData] = useState({
    today: 0,
    isLoading: true
  });

  const orderCounts = useOrderCounts(restaurantId);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const todayRevenue = await getRevenueData(restaurantId, 'today');
        setRevenueData({
          today: todayRevenue,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setRevenueData({
          today: 0,
          isLoading: false
        });
      }
    };

    fetchRevenueData();
  }, [restaurantId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Orders</p>
            {orderCounts.isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{orderCounts.today || 0}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Revenue</p>
            {revenueData.isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-2xl font-bold">{formatCurrency(revenueData.today)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Orders</p>
            {orderCounts.isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{orderCounts.pending || 0}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OrderAnalyticsSummary;
