
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShiftSchedule } from '@/types/shift';

export const useShiftData = (staffId?: string) => {
  const [shiftData, setShiftData] = useState<ShiftSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchShiftData = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('staff_shifts')
        .select('*')
        .order('shift_date', { ascending: false });
      
      if (staffId) {
        query = query.eq('staff_id', staffId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Type assertion with unknown as an intermediate step
      setShiftData((data as unknown as ShiftSchedule[]) || []);
    } catch (error) {
      console.error('Error fetching shift data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shift data',
        variant: 'destructive',
      });
      
      // Sample data for testing
      setShiftData(getSampleShiftData(staffId));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShiftData();
    
    // Set up realtime subscription for shifts table updates
    const shiftsSubscription = supabase
      .channel('shifts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'staff_shifts' }, 
        (payload) => {
          console.log('Shift change detected:', payload);
          fetchShiftData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(shiftsSubscription);
    };
  }, [staffId, toast]);

  return { 
    shiftData, 
    isLoading,
    refetchShifts: fetchShiftData
  };
};

// Sample data for testing
const getSampleShiftData = (staffId?: string): ShiftSchedule[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const baseData = [
    {
      id: '1',
      staff_id: '1',
      shift_date: today.toISOString().split('T')[0],
      start_time: '09:00:00',
      end_time: '17:00:00',
      status: 'scheduled',
      notes: null,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      staff_id: '2',
      shift_date: today.toISOString().split('T')[0],
      start_time: '12:00:00',
      end_time: '20:00:00',
      status: 'scheduled',
      notes: null,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      staff_id: '3',
      shift_date: today.toISOString().split('T')[0],
      start_time: '08:00:00',
      end_time: '16:00:00',
      status: 'scheduled',
      notes: null,
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      staff_id: '1',
      shift_date: tomorrow.toISOString().split('T')[0],
      start_time: '09:00:00',
      end_time: '17:00:00',
      status: 'scheduled',
      notes: null,
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      staff_id: '2',
      shift_date: tomorrow.toISOString().split('T')[0],
      start_time: '12:00:00',
      end_time: '20:00:00',
      status: 'scheduled',
      notes: null,
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      staff_id: '4',
      shift_date: dayAfterTomorrow.toISOString().split('T')[0],
      start_time: '08:00:00',
      end_time: '16:00:00',
      status: 'scheduled',
      notes: null,
      created_at: new Date().toISOString()
    }
  ] as ShiftSchedule[];
  
  if (staffId) {
    return baseData.filter(record => record.staff_id === staffId);
  }
  
  return baseData;
};
