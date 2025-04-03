
import { useState, useEffect } from 'react';
import { StaffAttendanceStats } from '@/types/staff';
import { generateStaffAttendance } from '@/utils/demo-data/staff-attendance';
import { supabase } from '@/integrations/supabase/client';

export const useAttendanceData = (staffId: string) => {
  const [attendanceData, setAttendanceData] = useState<StaffAttendanceStats>({
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    presentPercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        // Try to fetch real attendance data from Supabase
        // This is a placeholder for when you implement real attendance tracking
        const { data, error } = await supabase
          .from('staff_attendance')
          .select('*')
          .eq('staff_id', staffId);
          
        if (error) {
          console.error('Error fetching attendance data:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Process real data when available
          // This is a placeholder for actual data processing
          console.log('Fetched attendance data:', data);
          
          // For now, we'll use demo data
          const demoAttendance = generateStaffAttendance(staffId);
          setAttendanceData(demoAttendance);
        } else {
          // Use demo data if no real data is found
          console.log('No attendance data found, using demo data');
          const demoAttendance = generateStaffAttendance(staffId);
          setAttendanceData(demoAttendance);
        }
      } catch (error) {
        console.error('Error in attendance data fetch:', error);
        // Fallback to demo data
        const demoAttendance = generateStaffAttendance(staffId);
        setAttendanceData(demoAttendance);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (staffId) {
      fetchAttendanceData();
    }
  }, [staffId]);

  return {
    attendanceData,
    isLoading
  };
};
