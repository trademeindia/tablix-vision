
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
}

export type StaffRole = 'Waiter' | 'Chef' | 'Manager' | 'Receptionist';

export interface StaffFormData {
  name: string;
  phone: string;
  email: string;
  role: StaffRole;
  status: 'active' | 'inactive';
}
