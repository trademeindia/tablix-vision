
import { useState, useEffect } from 'react';
import { StaffAttendanceStats } from '@/types/staff';
import { generateStaffAttendance } from '@/utils/demo-data/staff-attendance';

export const useAttendanceData = (staffCount: number = 10) => {
  const [attendanceData, setAttendanceData] = useState<StaffAttendanceStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For now, we'll use the demo data generator
    const fetchData = () => {
      setIsLoading(true);
      try {
        const data = generateStaffAttendance(staffCount);
        setAttendanceData(data);
      } catch (error) {
        console.error('Error generating attendance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [staffCount]);
  
  return {
    attendanceData,
    isLoading
  };
};
