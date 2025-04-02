
import { useState, useEffect } from 'react';
import { getCustomerDemographics } from '@/services/analyticsService';

export function useCustomerDemographics(restaurantId: string | undefined) {
  const [demographicsData, setDemographicsData] = useState<Array<{name: string, value: number, color: string}>>([]);
  const [demographicsLoading, setDemographicsLoading] = useState(true);

  useEffect(() => {
    const fetchDemographicsData = async () => {
      try {
        setDemographicsLoading(true);
        const data = await getCustomerDemographics(restaurantId || '');
        setDemographicsData(data);
      } catch (error) {
        console.error('Error fetching demographics data:', error);
        setDemographicsData([
          { name: 'New', value: 30, color: '#3b82f6' },
          { name: 'Regular', value: 45, color: '#10b981' },
          { name: 'Frequent', value: 20, color: '#f59e0b' },
          { name: 'VIP', value: 5, color: '#8b5cf6' }
        ]);
      } finally {
        setDemographicsLoading(false);
      }
    };

    fetchDemographicsData();
  }, [restaurantId]);

  return { demographicsData, demographicsLoading };
}
