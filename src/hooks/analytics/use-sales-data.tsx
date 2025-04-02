
import { useState, useEffect } from 'react';
import { getSalesData } from '@/services/analyticsService';

export function useSalesData(restaurantId: string | undefined) {
  const [salesData, setSalesData] = useState<Array<{name: string, total: number}>>([]);
  const [salesDataLoading, setSalesDataLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setSalesDataLoading(true);
        const data = await getSalesData(restaurantId || '');
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
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

    fetchSalesData();
  }, [restaurantId]);

  return { salesData, salesDataLoading };
}
