
export interface AttendanceRecord {
  id: string;
  staff_id: string;
  check_in: string;
  check_out: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes: string | null;
  created_at: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  total: number;
}
