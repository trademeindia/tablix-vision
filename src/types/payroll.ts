
export interface PayrollRecord {
  id: string;
  staff_id: string;
  period_start: string;
  period_end: string;
  base_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  deductions: number;
  bonuses: number;
  total_amount: number;
  status: 'draft' | 'pending' | 'approved' | 'paid';
  payment_date: string | null;
  notes: string | null;
  created_at: string;
}
