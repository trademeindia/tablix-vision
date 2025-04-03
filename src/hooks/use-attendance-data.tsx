
import { useState, useEffect } from 'react';
import { StaffAttendanceStats, StaffAttendanceRecord } from '@/types/staff';
import { generateStaffAttendance } from '@/utils/demo-data/staff-attendance';
import { v4 as uuidv4 } from 'uuid';

export const useAttendanceData = (staffId: string) => {
  const [attendanceStats, setAttendanceStats] = useState<StaffAttendanceStats>({
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    presentPercentage: 0
  });
  const [attendanceData, setAttendanceData] = useState<StaffAttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from actual Supabase tables
        // Since the staff_attendance table doesn't exist in our schema yet,
        // we'll use demo data instead
        console.log('Generating demo attendance data for staff ID:', staffId);
        
        // Generate random attendance records for the last 30 days
        const records: StaffAttendanceRecord[] = [];
        const today = new Date();
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;
        
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          
          // Random status (biased towards 'present')
          const random = Math.random();
          let status: 'present' | 'absent' | 'late';
          
          if (random < 0.7) {
            status = 'present';
            presentCount++;
          } else if (random < 0.85) {
            status = 'late';
            lateCount++;
          } else {
            status = 'absent';
            absentCount++;
          }
          
          // Only add check-in/check-out times for present or late
          const checkIn = status !== 'absent' ? 
            `${Math.floor(Math.random() * 3) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 
            undefined;
            
          const checkOut = status !== 'absent' ? 
            `${Math.floor(Math.random() * 4) + 16}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 
            undefined;
            
          records.push({
            id: uuidv4(),
            date: date.toISOString(),
            status,
            check_in: checkIn,
            check_out: checkOut,
            notes: status === 'late' ? 'Traffic delay' : undefined
          });
        }
        
        // Calculate stats
        const totalDays = records.length;
        const presentPercentage = Math.round((presentCount / totalDays) * 100);
        
        setAttendanceData(records);
        setAttendanceStats({
          totalPresent: presentCount,
          totalAbsent: absentCount,
          totalLate: lateCount,
          presentPercentage
        });
      } catch (error) {
        console.error('Error generating attendance data:', error);
        // Fallback to empty data
        setAttendanceData([]);
        setAttendanceStats({
          totalPresent: 0,
          totalAbsent: 0, 
          totalLate: 0,
          presentPercentage: 0
        });
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
    attendanceStats,
    isLoading
  };
};
