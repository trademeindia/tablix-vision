
import { Customer } from '@/types/customer';

export const transformCustomerData = (data: any[]): Customer[] => {
  return data.map((customer) => ({
    id: customer.id,
    name: customer.name || '',
    email: customer.email,
    phone: customer.phone,
    created_at: customer.created_at,
    lastVisit: customer.last_visit || customer.created_at,
    
    // Provide default values for fields not in the database
    status: 'active',  // Default status
    visits: 0,         // Default visits
    loyaltyPoints: 0,  // Default loyalty points
    segment: 'new' as Customer['segment'],  // Default segment
    total_spent: customer.total_expenditure || 0,
    avgOrderValue: customer.total_expenditure ? customer.total_expenditure / 1 : 0,
    lifetime_value: customer.total_expenditure || 0,
    recent_orders: 0,
    retention_score: 50
  }));
};
