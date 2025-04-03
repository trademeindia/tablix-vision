
import { useState, useEffect } from 'react';
import { StaffAttendanceStats, StaffAttendanceRecord } from '@/types/staff';
import { v4 as uuidv4 } from 'uuid';
import { generateStaffAttendance } from '@/utils/demo-data/staff-attendance';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, parseISO, differenceInDays } from 'date-fns';

export const useAttendanceData = (staffId: string) => {
  const [attendanceRecords, setAttendanceRecords] = useState<StaffAttendanceRecord[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<StaffAttendanceStats>({
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    presentPercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        // Use a more generic approach that doesn't rely on specific type definitions
        const { data, error } = await supabase
          .from('staff_attendance')
          .select('*')
          .eq('staff_id', staffId);
          
        if (error) {
          console.error('Error fetching attendance data:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Use actual data from Supabase with type assertion for safety
          console.log(`Loaded ${data.length} attendance records for staff ${staffId}`);
          
          // Transform data to match our expected format
          const records: StaffAttendanceRecord[] = data.map((record: any) => ({
            id: record.id as string,
            date: record.date as string,
            status: record.status as 'present' | 'absent' | 'late',
            check_in: record.check_in as string | undefined,
            check_out: record.check_out as string | undefined,
            notes: record.notes as string | undefined
          }));
          
          // Calculate attendance stats
          const stats = calculateAttendanceStats(records);
          
          setAttendanceRecords(records);
          setAttendanceStats(stats);
        } else {
          // Generate demo data if no data found
          console.log(`No attendance data found for staff ${staffId}, generating demo data`);
          const { demoRecords, demoStats } = generateStaffAttendance(staffId);
          
          setAttendanceRecords(demoRecords);
          setAttendanceStats(demoStats);
        }
      } catch (error) {
        console.error('Falling back to demo data due to error:', error);
        // Generate demo data on error
        const { demoRecords, demoStats } = generateStaffAttendance(staffId);
        
        setAttendanceRecords(demoRecords);
        setAttendanceStats(demoStats);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendance();
  }, [staffId]);
  
  // Helper function to calculate attendance stats
  const calculateAttendanceStats = (records: StaffAttendanceRecord[]): StaffAttendanceStats => {
    const totalPresent = records.filter(record => record.status === 'present').length;
    const totalAbsent = records.filter(record => record.status === 'absent').length;
    const totalLate = records.filter(record => record.status === 'late').length;
    const totalDays = totalPresent + totalAbsent + totalLate;
    
    const presentPercentage = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;
    
    return {
      totalPresent,
      totalAbsent,
      totalLate,
      presentPercentage
    };
  };
  
  return {
    attendanceRecords,
    attendanceStats,
    isLoading
  };
};
