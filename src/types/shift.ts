
export interface ShiftSchedule {
  id: string;
  staff_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'missed' | 'swapped';
  notes: string | null;
  created_at: string;
}
