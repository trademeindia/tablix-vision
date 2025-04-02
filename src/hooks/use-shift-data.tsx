
import { useState, useEffect } from 'react';
import { generateStaffShifts } from '@/utils/demo-data/staff-data';

export const useShiftData = (staffId: string) => {
  const [shiftData, setShiftData] = useState<any[]>([]);
  const [upcomingShifts, setUpcomingShifts] = useState<any[]>([]);
  const [pastShifts, setPastShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Generate demo shift data
        const data = generateStaffShifts(staffId, 21); // 3 weeks of shifts
        setShiftData(data);
        
        // Current date for comparison
        const now = new Date();
        
        // Split into upcoming and past shifts
        const upcoming = data.filter(shift => {
          const shiftDate = new Date(shift.date);
          return shiftDate >= now;
        });
        
        const past = data.filter(shift => {
          const shiftDate = new Date(shift.date);
          return shiftDate < now;
        });
        
        setUpcomingShifts(upcoming);
        setPastShifts(past);
      } catch (error) {
        console.error('Error fetching shift data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (staffId) {
      fetchShifts();
    }
  }, [staffId]);

  return {
    shiftData,
    upcomingShifts,
    pastShifts,
    isLoading
  };
};
