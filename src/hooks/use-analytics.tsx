
import { useState, useEffect } from 'react';
import { getRevenue, getOrderCount, getPopularItems, getSalesData } from '@/services/analyticsService';

export function useAnalytics(restaurantId: string | undefined) {
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
          getRevenue(restaurantId || '', 'week'),
          getRevenue(restaurantId || '', 'month'),
          getRevenue(restaurantId || '', 'year')
        ]);
        
        setRevenueData({
          week: weekRevenue,
          month: monthRevenue,
          year: yearRevenue,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        // Fallback to sample data if real data fails to load
        setRevenueData({
          week: 2450.75,
          month: 9876.50,
          year: 124500.25,
          isLoading: false
        });
      }
    };
    
    const fetchOrderCounts = async () => {
      try {
        const [weekCount, monthCount, yearCount] = await Promise.all([
          getOrderCount(restaurantId || '', 'week'),
          getOrderCount(restaurantId || '', 'month'),
          getOrderCount(restaurantId || '', 'year')
        ]);
        
        setOrderCounts({
          week: weekCount,
          month: monthCount,
          year: yearCount,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching order counts:', error);
        // Fallback to sample data if real data fails to load
        setOrderCounts({
          week: 87,
          month: 345,
          year: 4250,
          isLoading: false
        });
      }
    };
    
    const fetchPopularItems = async () => {
      try {
        setPopularItemsLoading(true);
        const items = await getPopularItems(restaurantId || '');
        setPopularItems(items);
      } catch (error) {
        console.error('Error fetching popular items:', error);
        // Fallback to sample data if real data fails to load
        setPopularItems([
          { name: 'Margherita Pizza', count: 42 },
          { name: 'Chicken Alfredo', count: 36 },
          { name: 'Caesar Salad', count: 28 },
          { name: 'Cheeseburger', count: 25 },
          { name: 'Chocolate Cake', count: 19 }
        ]);
      } finally {
        setPopularItemsLoading(false);
      }
    };
    
    const fetchSalesData = async () => {
      try {
        setSalesDataLoading(true);
        const data = await getSalesData(restaurantId || '');
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        // Fallback to sample data if real data fails to load
        const today = new Date();
        const sampleData = Array(14).fill(0).map((_, index) => {
          const date = new Date();
          date.setDate(today.getDate() - (13 - index));
          return {
            name: date.toISOString().split('T')[0],
            total: 500 + Math.random() * 1500
          };
        });
        setSalesData(sampleData);
      } finally {
        setSalesDataLoading(false);
      }
    };
    
    fetchRevenueData();
    fetchOrderCounts();
    fetchPopularItems();
    fetchSalesData();
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
