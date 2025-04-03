
import { useState, useEffect } from 'react';
import { StaffAttendanceStats, StaffAttendanceRecord } from '@/types/staff';
import { v4 as uuidv4 } from 'uuid';
import { generateStaffAttendance } from '@/utils/demo-data/staff-attendance';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';

export const useAttendanceData = (staffId: string) => {
  const [attendanceData, setAttendanceData] = useState<StaffAttendanceRecord[]>([]);
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
        // Try to get data from Supabase first
        const { data, error } = await supabase
          .from('staff_attendance')
          .select('*')
          .eq('staff_id', staffId);
          
        if (error) {
          console.error('Error fetching attendance data:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Use actual data from Supabase
          console.log(`Loaded ${data.length} attendance records for staff ${staffId}`);
          // Transform data to match our expected format
          const records: StaffAttendanceRecord[] = data.map(record => ({
            id: record.id,
            date: record.date,
            status: record.status as 'present' | 'absent' | 'late',
            check_in: record.check_in || undefined,
            check_out: record.check_out || undefined,
            notes: record.notes || undefined
          }));
          
          // Calculate statistics
          const stats = calculateAttendanceStats(records);
          
          setAttendanceData(records);
          setAttendanceStats(stats);
        } else {
          // Generate demo data if no data found
          console.log(`No attendance data found for staff ${staffId}, generating demo data`);
          const demoStats = generateStaffAttendance(staffId);
          const demoRecords = generateDemoAttendanceRecords(staffId, 30);
          
          setAttendanceData(demoRecords);
          setAttendanceStats(demoStats);
        }
      } catch (error) {
        console.error('Falling back to demo data due to error:', error);
        // Generate demo data on error
        const demoStats = generateStaffAttendance(staffId);
        const demoRecords = generateDemoAttendanceRecords(staffId, 30);
        
        setAttendanceData(demoRecords);
        setAttendanceStats(demoStats);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendance();
  }, [staffId]);
  
  // Helper function to calculate attendance statistics
  const calculateAttendanceStats = (records: StaffAttendanceRecord[]): StaffAttendanceStats => {
    const present = records.filter(record => record.status === 'present').length;
    const absent = records.filter(record => record.status === 'absent').length;
    const late = records.filter(record => record.status === 'late').length;
    const total = records.length || 1; // Prevent division by zero
    
    return {
      totalPresent: present,
      totalAbsent: absent,
      totalLate: late,
      presentPercentage: Math.round((present / total) * 100)
    };
  };
  
  // Helper function to generate demo attendance records
  const generateDemoAttendanceRecords = (staffId: string, days: number): StaffAttendanceRecord[] => {
    const records: StaffAttendanceRecord[] = [];
    const statuses: ('present' | 'absent' | 'late')[] = ['present', 'absent', 'late'];
    const statusWeights = [0.8, 0.1, 0.1]; // 80% present, 10% absent, 10% late
    
    for (let i = 0; i < days; i++) {
      const date = subDays(new Date(), i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Weighted random selection
      const rand = Math.random();
      let cumulativeWeight = 0;
      let selectedStatus: 'present' | 'absent' | 'late' = 'present';
      
      for (let j = 0; j < statuses.length; j++) {
        cumulativeWeight += statusWeights[j];
        if (rand <= cumulativeWeight) {
          selectedStatus = statuses[j];
          break;
        }
      }
      
      // Generate check-in/check-out times for present and late
      let checkIn = null;
      let checkOut = null;
      let notes = null;
      
      if (selectedStatus === 'present') {
        checkIn = '09:00 AM';
        checkOut = '05:00 PM';
      } else if (selectedStatus === 'late') {
        checkIn = `${Math.floor(Math.random() * 3) + 9}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`;
        checkOut = '05:30 PM';
        notes = 'Traffic delay';
      } else if (selectedStatus === 'absent') {
        notes = Math.random() > 0.5 ? 'Sick leave' : 'Personal emergency';
      }
      
      records.push({
        id: uuidv4(),
        date: formattedDate,
        status: selectedStatus,
        check_in: checkIn,
        check_out: checkOut,
        notes: notes
      });
    }
    
    // Sort by date, most recent first
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  return {
    attendanceData,
    attendanceStats,
    isLoading
  };
};
