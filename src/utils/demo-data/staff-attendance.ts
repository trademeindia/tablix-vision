
import { StaffAttendanceStats } from '@/types/staff';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate random attendance statistics for staff members
 */
export const generateStaffAttendance = (count: number) => {
  const attendanceRecords: StaffAttendanceStats[] = [];
  
  for (let i = 0; i < count; i++) {
    const totalDays = 30;
    const present = Math.floor(Math.random() * (totalDays - 5)) + 20; // Between 20-25 days present
    const absent = Math.floor(Math.random() * 5); // Between 0-5 days absent
    const late = totalDays - present - absent; // Remaining days are late
    
    attendanceRecords.push({
      totalPresent: present,
      totalAbsent: absent,
      totalLate: late,
      presentPercentage: Math.round((present / totalDays) * 100)
    });
  }
  
  return attendanceRecords;
};
