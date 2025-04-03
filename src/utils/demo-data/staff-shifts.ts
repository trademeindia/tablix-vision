
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate random shift data for staff members
 */
export const generateStaffShifts = (staffId: string) => {
  // This function is now only used as a fallback
  // The main implementation is in useShiftData directly
  
  const upcomingShifts = [];
  const pastShifts = [];
  const today = new Date();
  
  // Generate upcoming shifts
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    upcomingShifts.push({
      id: uuidv4(),
      staff_id: staffId,
      date: date.toISOString(),
      start_time: '09:00',
      end_time: '17:00',
      position: 'Waiter',
      status: 'scheduled'
    });
  }
  
  // Generate past shifts
  for (let i = 1; i < 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    pastShifts.push({
      id: uuidv4(),
      staff_id: staffId,
      date: date.toISOString(),
      start_time: '09:00',
      end_time: '17:00',
      position: 'Waiter',
      status: 'completed'
    });
  }
  
  return [...upcomingShifts, ...pastShifts];
};
