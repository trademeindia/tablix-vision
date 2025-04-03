
export interface Customer {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  visits?: number;
  lastVisit?: string;
  status?: string;
  loyaltyPoints?: number;
  created_at?: string;
  favorite_items?: string[];
  total_spent?: number;
  notes?: string;
  address?: string;
  birthday?: string;
  preferences?: {
    dietary?: string[];
    seating?: string;
    communication?: string;
  };
}
