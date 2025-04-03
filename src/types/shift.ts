
export interface StaffShift {
  id: string;
  date: string;
  type: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  start_time: string;
  end_time: string;
}

export interface StaffShiftSummary {
  shifts: StaffShift[];
  totalHoursThisWeek: number;
  totalShiftsThisWeek: number;
}
