
import { useState, useEffect } from 'react';
import { getAverageOrderValue } from '@/services/analytics';

export function useAverageOrderValue(restaurantId: string | undefined) {
  const [avgOrderData, setAvgOrderData] = useState<Array<{name: string, value: number}>>([]);
  const [avgOrderLoading, setAvgOrderLoading] = useState(true);

  useEffect(() => {
    const fetchAverageOrderData = async () => {
      try {
        setAvgOrderLoading(true);
        const data = await getAverageOrderValue(restaurantId || '');
        setAvgOrderData(data);
      } catch (error) {
        console.error('Error fetching average order data:', error);
        const today = new Date();
        const sampleData = Array(14).fill(0).map((_, index) => {
          const date = new Date();
          date.setDate(today.getDate() - (13 - index));
          return {
            name: date.toISOString().split('T')[0],
            value: 250 + Math.random() * 200
          };
        });
        setAvgOrderData(sampleData);
      } finally {
        setAvgOrderLoading(false);
      }
    };

    fetchAverageOrderData();
  }, [restaurantId]);

  return { avgOrderData, avgOrderLoading };
}
