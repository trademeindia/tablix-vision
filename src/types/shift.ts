
export interface StaffShift {
  id: string;
  staff_id: string;
  date: string;
  start_time: string;
  end_time: string;
  position: string;
  status: 'scheduled' | 'completed' | 'canceled';
  notes?: string;
}
