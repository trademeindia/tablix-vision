
import { useState, useEffect } from 'react';
import { StaffShift } from '@/types/shift';
import { v4 as uuidv4 } from 'uuid';
import { generateStaffShifts } from '@/utils/demo-data/staff-shifts';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, subDays, isFuture, isPast } from 'date-fns';

export const useShiftData = (staffId: string) => {
  const [upcomingShifts, setUpcomingShifts] = useState<StaffShift[]>([]);
  const [pastShifts, setPastShifts] = useState<StaffShift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchShifts = async () => {
      setIsLoading(true);
      try {
        // Since the staff_shifts table might not be in the types, 
        // we'll use a more generic approach without relying on type definitions
        const { data, error } = await supabase
          .from('staff_shifts')
          .select('*')
          .eq('staff_id', staffId);
          
        if (error) {
          console.error('Error fetching shift data:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Use actual data from Supabase
          console.log(`Loaded ${data.length} shift records for staff ${staffId}`);
          
          // Transform data to match our expected format with type assertions for safety
          const shifts: StaffShift[] = data.map(shift => ({
            id: shift.id as string,
            staff_id: shift.staff_id as string,
            date: shift.date as string,
            start_time: shift.start_time as string,
            end_time: shift.end_time as string,
            position: shift.position as string,
            status: shift.status as 'scheduled' | 'completed' | 'canceled',
            notes: (shift.notes as string) || undefined
          }));
          
          // Sort shifts into upcoming and past
          const upcoming: StaffShift[] = [];
          const past: StaffShift[] = [];
          
          shifts.forEach(shift => {
            const shiftDate = new Date(shift.date);
            if (isFuture(shiftDate)) {
              upcoming.push(shift);
            } else {
              past.push(shift);
            }
          });
          
          setUpcomingShifts(upcoming);
          setPastShifts(past);
        } else {
          // Generate demo data if no data found
          console.log(`No shift data found for staff ${staffId}, generating demo data`);
          const demoShifts = generateStaffShifts(staffId);
          
          // Sort demo shifts into upcoming and past
          const upcoming: StaffShift[] = [];
          const past: StaffShift[] = [];
          
          demoShifts.forEach(shift => {
            const shiftDate = new Date(shift.date);
            if (isFuture(shiftDate)) {
              upcoming.push(shift);
            } else {
              past.push(shift);
            }
          });
          
          setUpcomingShifts(upcoming);
          setPastShifts(past);
        }
      } catch (error) {
        console.error('Falling back to demo data due to error:', error);
        // Generate demo data on error
        const demoShifts = generateStaffShifts(staffId);
        
        // Sort demo shifts into upcoming and past
        const upcoming: StaffShift[] = [];
        const past: StaffShift[] = [];
        
        demoShifts.forEach(shift => {
          const shiftDate = new Date(shift.date);
          if (isFuture(shiftDate)) {
            upcoming.push(shift);
          } else {
            past.push(shift);
          }
        });
        
        setUpcomingShifts(upcoming);
        setPastShifts(past);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShifts();
  }, [staffId]);
  
  return {
    upcomingShifts,
    pastShifts,
    isLoading
  };
};
