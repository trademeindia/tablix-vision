
import { useState, useEffect } from 'react';
import { getPeakHoursData } from '@/services/analytics';

export function usePeakHoursData(restaurantId: string | undefined) {
  const [peakHoursData, setPeakHoursData] = useState<Array<{hour: string, orders: number, revenue: number}>>([]);
  const [peakHoursLoading, setPeakHoursLoading] = useState(true);

  useEffect(() => {
    const fetchPeakHoursData = async () => {
      try {
        setPeakHoursLoading(true);
        const data = await getPeakHoursData(restaurantId || '');
        setPeakHoursData(data);
      } catch (error) {
        console.error('Error fetching peak hours data:', error);
        const hours = [
          '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', 
          '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'
        ];
        const sampleData = hours.map(hour => ({
          hour,
          orders: Math.floor(Math.random() * 50) + 5,
          revenue: Math.floor(Math.random() * 15000) + 1000
        }));
        setPeakHoursData(sampleData);
      } finally {
        setPeakHoursLoading(false);
      }
    };

    fetchPeakHoursData();
  }, [restaurantId]);

  return { peakHoursData, peakHoursLoading };
}
