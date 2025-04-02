
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AttendanceRecord, AttendanceStats } from '@/types/attendance';

export const useAttendanceData = (staffId?: string) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        // This would normally fetch data from Supabase
        // Since 'staff_attendance' table doesn't exist yet, we'll use sample data
        const sampleData = getSampleAttendanceData(staffId);
        setAttendanceData(sampleData);
        
        // Calculate stats
        const stats: AttendanceStats = {
          present: sampleData.filter(item => item.status === 'present').length,
          absent: sampleData.filter(item => item.status === 'absent').length,
          late: sampleData.filter(item => item.status === 'late').length,
          halfDay: sampleData.filter(item => item.status === 'half-day').length,
          total: sampleData.length
        };
        
        setAttendanceStats(stats);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load attendance data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [staffId, toast]);

  return { 
    attendanceData, 
    attendanceStats,
    isLoading 
  };
};

// Sample data for testing
const getSampleAttendanceData = (staffId?: string): AttendanceRecord[] => {
  // Generate 30 days of attendance records
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Randomly determine status
    const statusOptions: ('present' | 'absent' | 'late' | 'half-day')[] = ['present', 'present', 'present', 'present', 'absent', 'late', 'half-day'];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    // Create check-in time (9 AM +/- 1 hour)
    const checkInHour = status === 'late' ? 10 + Math.random() : 8 + Math.random();
    const checkInDate = new Date(date);
    checkInDate.setHours(checkInHour, Math.floor(Math.random() * 60), 0);
    
    // Create check-out time (5 PM +/- 1 hour) if present or late
    let checkOutDate = null;
    if (status !== 'absent') {
      const checkOutHour = status === 'half-day' ? 13 + Math.random() : 16 + Math.random();
      checkOutDate = new Date(date);
      checkOutDate.setHours(checkOutHour, Math.floor(Math.random() * 60), 0);
    }
    
    records.push({
      id: `att-${staffId || 'sample'}-${i}`,
      staff_id: staffId || 'sample',
      check_in: checkInDate.toISOString(),
      check_out: checkOutDate ? checkOutDate.toISOString() : null,
      status,
      notes: status === 'absent' ? 'Sick leave' : null,
      created_at: date.toISOString()
    });
  }
  
  return records;
};
