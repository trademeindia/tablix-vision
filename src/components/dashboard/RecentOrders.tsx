
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecentOrders } from '@/services/order';
import { Order } from '@/services/order/types';
import { formatDistanceToNow } from 'date-fns';

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-purple-100 text-purple-800 border-purple-200",
  served: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock restaurant ID - in a real app, get this from context or API
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';
  
  useEffect(() => {
    const fetchRecentOrders = async () => {
      setIsLoading(true);
      try {
        const data = await getRecentOrders(restaurantId);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentOrders();
  }, [restaurantId]);
  
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Unknown time';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Use dummy data if no real data is available
  const displayOrders = orders.length > 0 ? orders : [];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : displayOrders.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">No recent orders found.</p>
        ) : (
          <div className="space-y-4">
            {displayOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div>
                  <p className="font-medium">#{order.id?.substring(0, 8) || 'N/A'}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-slate-500">Table {order.table_number}</span>
                    <span className="text-sm text-slate-400 mx-2">•</span>
                    <span className="text-sm text-slate-500">{order.items?.length || 0} items</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                    <p className="text-sm text-slate-500">{getTimeAgo(order.created_at)}</p>
                  </div>
                  
                  <Badge className={cn("capitalize", statusStyles[order.status || 'pending'])}>
                    {order.status || 'pending'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
