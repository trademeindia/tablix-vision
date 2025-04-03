
import { StaffAttendanceStats, StaffAttendanceRecord } from '@/types/staff';
import { v4 as uuidv4 } from 'uuid';
import { format, subDays } from 'date-fns';

/**
 * Generate random attendance statistics and records for staff members
 */
export const generateStaffAttendance = (staffId: string) => {
  // Generate random attendance stats
  const totalDays = 30;
  const present = Math.floor(Math.random() * (totalDays - 5)) + 20; // Between 20-25 days present
  const absent = Math.floor(Math.random() * 5); // Between 0-5 days absent
  const late = totalDays - present - absent; // Remaining days are late
  
  const demoStats: StaffAttendanceStats = {
    totalPresent: present,
    totalAbsent: absent,
    totalLate: late,
    presentPercentage: Math.round((present / totalDays) * 100)
  };
  
  // Generate random attendance records for the last 30 days
  const demoRecords: StaffAttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 0; i < totalDays; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Determine status based on the proportions we want
    let status: 'present' | 'absent' | 'late';
    const rand = Math.random();
    if (rand < present / totalDays) {
      status = 'present';
    } else if (rand < (present + absent) / totalDays) {
      status = 'absent';
    } else {
      status = 'late';
    }
    
    // Generate check-in and check-out times for present and late
    let checkIn = undefined;
    let checkOut = undefined;
    
    if (status !== 'absent') {
      // Base check-in time (9:00 AM)
      const baseHour = 9;
      // For late, add 15-90 minutes
      const lateMinutes = status === 'late' ? Math.floor(Math.random() * 75) + 15 : 0;
      // Random variation of ±15 minutes for normal arrival
      const randomVariation = Math.floor(Math.random() * 30) - 15;
      
      const totalMinutes = (baseHour * 60) + lateMinutes + randomVariation;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      checkIn = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Check-out time (usually 8 hours after check-in, with variation)
      const checkInMinutes = hours * 60 + minutes;
      const workDuration = Math.floor(Math.random() * 60) + 480; // 8 hours ± 30 minutes
      const checkOutTotalMinutes = checkInMinutes + workDuration;
      
      const checkOutHours = Math.floor(checkOutTotalMinutes / 60);
      const checkOutMinutes = checkOutTotalMinutes % 60;
      
      checkOut = `${checkOutHours.toString().padStart(2, '0')}:${checkOutMinutes.toString().padStart(2, '0')}`;
    }
    
    // Add occasional notes
    let notes = undefined;
    if (Math.random() < 0.2) {
      const noteOptions = [
        'Called in sick',
        'Family emergency',
        'Doctor appointment',
        'Public transport delay',
        'Traffic jam',
        'Left early for personal reasons',
        'Worked extra hours',
        'Covered for colleague'
      ];
      notes = noteOptions[Math.floor(Math.random() * noteOptions.length)];
    }
    
    demoRecords.push({
      id: uuidv4(),
      date: dateStr,
      status,
      check_in: checkIn,
      check_out: checkOut,
      notes
    });
  }
  
  return { demoRecords, demoStats };
};
