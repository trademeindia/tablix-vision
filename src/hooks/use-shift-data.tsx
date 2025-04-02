
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShiftSchedule } from '@/types/shift';

export const useShiftData = (staffId?: string) => {
  const [shiftData, setShiftData] = useState<ShiftSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShiftData = async () => {
      setIsLoading(true);
      try {
        // This would normally fetch data from Supabase
        // Since 'staff_shifts' table doesn't exist yet, we'll use sample data
        const sampleData = getSampleShiftData(staffId);
        setShiftData(sampleData);
      } catch (error) {
        console.error('Error fetching shift data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shift data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShiftData();
  }, [staffId, toast]);

  return { 
    shiftData, 
    isLoading 
  };
};

// Sample data for testing
const getSampleShiftData = (staffId?: string): ShiftSchedule[] => {
  const shifts: ShiftSchedule[] = [];
  const today = new Date();
  
  // Generate past, current, and future shifts
  for (let i = -15; i < 15; i++) {
    const shiftDate = new Date();
    shiftDate.setDate(today.getDate() + i);
    
    // Skip random days (not all days have shifts)
    if (Math.random() > 0.7 && i !== 0) continue;
    
    // Generate shift data
    const isToday = i === 0;
    const isPast = i < 0;
    
    // Determine status based on whether the shift is past, present, or future
    let status: 'scheduled' | 'completed' | 'missed' | 'swapped' = 'scheduled';
    if (isPast) {
      const statusOptions: ('completed' | 'missed' | 'swapped')[] = ['completed', 'completed', 'completed', 'completed', 'missed', 'swapped'];
      status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    }
    
    // Generate shift times (morning, afternoon, or evening shift)
    const shiftType = Math.floor(Math.random() * 3);
    let startTime = '';
    let endTime = '';
    
    switch (shiftType) {
      case 0: // Morning shift
        startTime = '08:00';
        endTime = '16:00';
        break;
      case 1: // Afternoon shift
        startTime = '12:00';
        endTime = '20:00';
        break;
      case 2: // Evening shift
        startTime = '16:00';
        endTime = '00:00';
        break;
    }
    
    // Generate some notes for certain shifts
    let notes = null;
    if (status === 'swapped') {
      notes = 'Swapped with Jane Doe';
    } else if (status === 'missed') {
      notes = 'Called in sick';
    } else if (isToday) {
      notes = 'Regular shift';
    }
    
    shifts.push({
      id: `shift-${staffId || 'sample'}-${i + 15}`,
      staff_id: staffId || 'sample',
      shift_date: shiftDate.toISOString().split('T')[0],
      start_time: startTime,
      end_time: endTime,
      status,
      notes,
      created_at: new Date(shiftDate.getFullYear(), shiftDate.getMonth(), shiftDate.getDate() - 15).toISOString()
    });
  }
  
  return shifts;
};
