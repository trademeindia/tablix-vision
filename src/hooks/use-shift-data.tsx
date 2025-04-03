
import { useState, useEffect } from 'react';
import { generateStaffShifts } from '@/utils/demo-data/staff-shifts';

export const useShiftData = (staffCount: number = 10) => {
  const [shiftData, setShiftData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For now, we'll use the demo data generator
    const fetchData = () => {
      setIsLoading(true);
      try {
        const data = generateStaffShifts(staffCount);
        setShiftData(data);
      } catch (error) {
        console.error('Error generating shift data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [staffCount]);
  
  return {
    shiftData,
    isLoading
  };
};
