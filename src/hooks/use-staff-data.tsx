
import { useState, useEffect } from 'react';
import { StaffMember } from '@/types/staff';
import { generateDemoStaffData } from '@/utils/demo-data/staff-data';

// Mock API call to fetch staff data
const fetchStaffData = async (): Promise<StaffMember[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return generateDemoStaffData(12);
};

export const useStaffData = () => {
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStaffData();
      setStaffData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching staff data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetchStaff = () => {
    fetchData();
  };

  return {
    staffData,
    isLoading,
    error,
    refetchStaff
  };
};
