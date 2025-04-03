
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate random shift data for staff members
 */
export const generateStaffShifts = (count: number) => {
  const shiftRecords = [];
  
  const shiftTypes = ['Morning', 'Afternoon', 'Evening', 'Night'];
  
  for (let i = 0; i < count; i++) {
    // Generate shifts for the next 7 days
    const shifts = [];
    const today = new Date();
    
    for (let day = 0; day < 7; day++) {
      const shiftDate = new Date(today);
      shiftDate.setDate(today.getDate() + day);
      
      // Randomly decide if there's a shift this day (80% chance)
      if (Math.random() < 0.8) {
        const shiftType = shiftTypes[Math.floor(Math.random() * shiftTypes.length)];
        
        shifts.push({
          id: uuidv4(),
          date: shiftDate.toISOString(),
          type: shiftType,
          start_time: shiftType === 'Morning' ? '08:00' : 
                      shiftType === 'Afternoon' ? '12:00' : 
                      shiftType === 'Evening' ? '16:00' : '22:00',
          end_time: shiftType === 'Morning' ? '12:00' : 
                    shiftType === 'Afternoon' ? '16:00' : 
                    shiftType === 'Evening' ? '22:00' : '06:00'
        });
      }
    }
    
    shiftRecords.push({
      shifts,
      totalHoursThisWeek: Math.floor(Math.random() * 20) + 20, // Between 20-40 hours
      totalShiftsThisWeek: shifts.length
    });
  }
  
  return shiftRecords;
};
