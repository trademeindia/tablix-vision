
import { useState, useEffect } from 'react';
import { StaffAttendanceStats } from '@/types/staff';
import { generateStaffAttendance } from '@/utils/demo-data/staff-data';

export const useAttendanceData = (staffId: string) => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
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
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate demo attendance data
        const data = generateStaffAttendance(staffId, 30);
        setAttendanceData(data);
        
        // Calculate statistics
        const totalPresent = data.filter(record => record.status === 'present').length;
        const totalAbsent = data.filter(record => record.status === 'absent').length;
        const totalLate = data.filter(record => record.status === 'late').length;
        const presentPercentage = Math.round((totalPresent / data.length) * 100);
        
        setAttendanceStats({
          totalPresent,
          totalAbsent,
          totalLate,
          presentPercentage
        });
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (staffId) {
      fetchAttendance();
    }
  }, [staffId]);

  return {
    attendanceData,
    attendanceStats,
    isLoading
  };
};
