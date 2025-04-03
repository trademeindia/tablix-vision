
import { useState, useEffect } from 'react';
import { StaffShift } from '@/types/shift';
import { v4 as uuidv4 } from 'uuid';

export const useShiftData = (staffId: string) => {
  const [upcomingShifts, setUpcomingShifts] = useState<StaffShift[]>([]);
  const [pastShifts, setPastShifts] = useState<StaffShift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShiftData = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from actual Supabase tables
        // Since the staff_shifts table doesn't exist yet, we'll use demo data
        console.log('Generating demo shift data for staff ID:', staffId);
        
        const upcoming: StaffShift[] = [];
        const past: StaffShift[] = [];
        const today = new Date();
        
        // Generate shifts spanning past 10 days to future 10 days
        for (let i = -10; i < 10; i++) {
          // Not every day has a shift (probability 70%)
          if (Math.random() < 0.7) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const positions = ['Server', 'Host', 'Bartender', 'Manager'];
            const position = positions[Math.floor(Math.random() * positions.length)];
            
            const shift: StaffShift = {
              id: uuidv4(),
              staff_id: staffId,
              date: date.toISOString(),
              start_time: `${Math.floor(Math.random() * 4) + 8}:00`,
              end_time: `${Math.floor(Math.random() * 4) + 16}:00`,
              position,
              status: i < 0 ? 'completed' : 'scheduled',
              notes: Math.random() < 0.3 ? 'Special event' : undefined
            };
            
            if (i < 0) {
              past.push(shift);
            } else {
              upcoming.push(shift);
            }
          }
        }
        
        // Sort shifts by date
        past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setUpcomingShifts(upcoming);
        setPastShifts(past);
      } catch (error) {
        console.error('Error in shift data fetch:', error);
        // Fallback to empty arrays
        setUpcomingShifts([]);
        setPastShifts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (staffId) {
      fetchShiftData();
    }
  }, [staffId]);

  return {
    shiftData: [...upcomingShifts, ...pastShifts],
    upcomingShifts,
    pastShifts,
    isLoading
  };
};
