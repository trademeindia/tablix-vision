
import { useState, useEffect } from 'react';
import { getRevenue, getOrderCount, getPopularItems, getSalesData } from '@/services/analyticsService';

export function useAnalytics(restaurantId: string) {
  const [revenueData, setRevenueData] = useState({
    week: 0,
    month: 0,
    year: 0,
    isLoading: true
  });
  
  const [orderCounts, setOrderCounts] = useState({
    week: 0,
    month: 0,
    year: 0,
    isLoading: true
  });
  
  const [popularItems, setPopularItems] = useState<Array<{name: string, count: number}>>([]);
  const [popularItemsLoading, setPopularItemsLoading] = useState(true);
  
  const [salesData, setSalesData] = useState<Array<{name: string, total: number}>>([]);
  const [salesDataLoading, setSalesDataLoading] = useState(true);
  
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const [weekRevenue, monthRevenue, yearRevenue] = await Promise.all([
          getRevenue(restaurantId, 'week'),
          getRevenue(restaurantId, 'month'),
          getRevenue(restaurantId, 'year')
        ]);
        
        setRevenueData({
          week: weekRevenue,
          month: monthRevenue,
          year: yearRevenue,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setRevenueData(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    const fetchOrderCounts = async () => {
      try {
        const [weekCount, monthCount, yearCount] = await Promise.all([
          getOrderCount(restaurantId, 'week'),
          getOrderCount(restaurantId, 'month'),
          getOrderCount(restaurantId, 'year')
        ]);
        
        setOrderCounts({
          week: weekCount,
          month: monthCount,
          year: yearCount,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching order counts:', error);
        setOrderCounts(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    const fetchPopularItems = async () => {
      try {
        setPopularItemsLoading(true);
        const items = await getPopularItems(restaurantId);
        setPopularItems(items);
      } catch (error) {
        console.error('Error fetching popular items:', error);
      } finally {
        setPopularItemsLoading(false);
      }
    };
    
    const fetchSalesData = async () => {
      try {
        setSalesDataLoading(true);
        const data = await getSalesData(restaurantId);
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setSalesDataLoading(false);
      }
    };
    
    if (restaurantId) {
      fetchRevenueData();
      fetchOrderCounts();
      fetchPopularItems();
      fetchSalesData();
    }
  }, [restaurantId]);
  
  return {
    revenueData,
    orderCounts,
    popularItems,
    popularItemsLoading,
    salesData,
    salesDataLoading
  };
}
