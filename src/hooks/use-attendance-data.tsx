
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

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('staff_attendance')
        .select('*')
        .order('check_in', { ascending: false });
      
      if (staffId) {
        query = query.eq('staff_id', staffId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Type assertion with unknown as an intermediate step
      const typedData = (data as unknown as AttendanceRecord[]) || [];
      setAttendanceData(typedData);
      
      // Calculate attendance stats
      if (typedData.length > 0) {
        const stats = {
          present: typedData.filter(a => a.status === 'present').length,
          absent: typedData.filter(a => a.status === 'absent').length,
          late: typedData.filter(a => a.status === 'late').length,
          halfDay: typedData.filter(a => a.status === 'half-day').length,
          total: typedData.length
        };
        setAttendanceStats(stats);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load attendance data',
        variant: 'destructive',
      });
      
      // Sample data for testing
      setAttendanceData(getSampleAttendanceData(staffId));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    
    // Set up realtime subscription for attendance table updates
    const attendanceSubscription = supabase
      .channel('attendance_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'staff_attendance' }, 
        (payload) => {
          console.log('Attendance change detected:', payload);
          fetchAttendanceData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(attendanceSubscription);
    };
  }, [staffId, toast]);

  return { 
    attendanceData, 
    attendanceStats,
    isLoading,
    refetchAttendance: fetchAttendanceData
  };
};

// Sample data for testing
const getSampleAttendanceData = (staffId?: string): AttendanceRecord[] => {
  const baseData = [
    {
      id: '1',
      staff_id: '1',
      check_in: new Date(new Date().setHours(9, 0, 0)).toISOString(),
      check_out: new Date(new Date().setHours(17, 30, 0)).toISOString(),
      status: 'present',
      notes: null,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      staff_id: '1',
      check_in: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      check_out: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      status: 'present',
      notes: null,
      created_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
    },
    {
      id: '3',
      staff_id: '2',
      check_in: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      check_out: null,
      status: 'absent',
      notes: 'Sick leave',
      created_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
    },
    {
      id: '4',
      staff_id: '3',
      check_in: new Date(new Date().setHours(9, 45, 0)).toISOString(),
      check_out: new Date(new Date().setHours(18, 0, 0)).toISOString(),
      status: 'late',
      notes: 'Traffic',
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      staff_id: '4',
      check_in: new Date(new Date().setHours(9, 0, 0)).toISOString(),
      check_out: new Date(new Date().setHours(13, 0, 0)).toISOString(),
      status: 'half-day',
      notes: 'Doctor appointment',
      created_at: new Date().toISOString()
    }
  ] as AttendanceRecord[];
  
  if (staffId) {
    return baseData.filter(record => record.staff_id === staffId);
  }
  
  return baseData;
};
