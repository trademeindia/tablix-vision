
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { useAnalytics } from '@/hooks/use-analytics';
import RevenueStats from '@/components/analytics/RevenueStats';
import OrderStats from '@/components/analytics/OrderStats';
import PopularItems from '@/components/analytics/PopularItems';
import SalesChart from '@/components/analytics/SalesChart';
import { supabase } from '@/integrations/supabase/client';

const ReportsPage = () => {
  const { toast } = useToast();
  const [restaurantId, setRestaurantId] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch restaurant ID from the authenticated user's profile
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('restaurant_id')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
            toast({
              title: 'Error',
              description: 'Failed to load restaurant data',
              variant: 'destructive',
            });
            setRestaurantId('123e4567-e89b-12d3-a456-426614174000'); // Fallback to placeholder
          } else if (profile?.restaurant_id) {
            setRestaurantId(profile.restaurant_id);
          } else {
            setRestaurantId('123e4567-e89b-12d3-a456-426614174000'); // Fallback to placeholder
          }
        } else {
          setRestaurantId('123e4567-e89b-12d3-a456-426614174000'); // Fallback to placeholder
        }
      } catch (error) {
        console.error('Error in fetchRestaurantId:', error);
        setRestaurantId('123e4567-e89b-12d3-a456-426614174000'); // Fallback to placeholder
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurantId();
  }, [toast]);
  
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
          isLoading={revenueData.isLoading || isLoading}
          currency={currency}
        />
        
        <OrderStats
          weeklyOrders={orderCounts.week}
          monthlyOrders={orderCounts.month}
          yearlyOrders={orderCounts.year}
          isLoading={orderCounts.isLoading || isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <PopularItems 
            items={popularItems} 
            isLoading={popularItemsLoading || isLoading} 
          />
        </div>
        
        <div className="lg:col-span-2">
          <SalesChart 
            data={salesData} 
            isLoading={salesDataLoading || isLoading}
            currency={currency}
          />
        </div>
      </div>
    </StaffDashboardLayout>
  );
};

export default ReportsPage;
