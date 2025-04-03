
export interface StaffMember {
  id: string;
  restaurant_id: string;
  user_id?: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  notification_preference?: any;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  salary?: number;
  hire_date?: string;
  department?: string;
  manager_id?: string;
  emergency_contact?: string;
  avatar_url?: string; // Added to match the database schema
  avatar?: string;     // For backward compatibility
  image?: string;      // For further compatibility
}

export type StaffRole = 'Waiter' | 'Chef' | 'Manager' | 'Receptionist';

export interface StaffFormData {
  name: string;
  phone: string;
  email: string;
  role: StaffRole;
  status: 'active' | 'inactive';
  salary?: number;
  hire_date?: string;
  department?: string;
  emergency_contact?: string;
  profile_image?: File | null; // Changed from avatar string to File object
}

export interface StaffAttendanceStats {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  presentPercentage: number;
}

export interface StaffPayrollSummary {
  totalPaid: number;
  pendingAmount: number;
  lastPaymentDate: string | null;
}
