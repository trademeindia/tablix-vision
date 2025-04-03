
import { useState, useEffect } from 'react';
import { StaffShift } from '@/types/shift';
import { generateStaffShifts } from '@/utils/demo-data/staff-shifts';
import { supabase } from '@/integrations/supabase/client';

export const useShiftData = (staffId: string) => {
  const [shiftData, setShiftData] = useState<StaffShift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShiftData = async () => {
      setIsLoading(true);
      try {
        // Try to fetch real shift data from Supabase
        // This is a placeholder for when you implement real shift tracking
        const { data, error } = await supabase
          .from('staff_shifts')
          .select('*')
          .eq('staff_id', staffId);
          
        if (error) {
          console.error('Error fetching shift data:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Process real data when available
          // This is a placeholder for actual data processing
          console.log('Fetched shift data:', data);
          
          // For now, we'll use demo data
          const demoShifts = generateStaffShifts(staffId);
          setShiftData(demoShifts);
        } else {
          // Use demo data if no real data is found
          console.log('No shift data found, using demo data');
          const demoShifts = generateStaffShifts(staffId);
          setShiftData(demoShifts);
        }
      } catch (error) {
        console.error('Error in shift data fetch:', error);
        // Fallback to demo data
        const demoShifts = generateStaffShifts(staffId);
        setShiftData(demoShifts);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (staffId) {
      fetchShiftData();
    }
  }, [staffId]);

  return {
    shiftData,
    isLoading
  };
};
