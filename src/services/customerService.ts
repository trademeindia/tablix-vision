
import { supabase } from '@/integrations/supabase/client';

// Customer type definition
export interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  created_at?: string;
  last_visit?: string;
}

/**
 * Find a customer by their phone number or email
 */
export const findCustomer = async (identifier: string): Promise<Customer | null> => {
  // Try to find by phone (most common identifier in restaurant setting)
  const { data: phoneData, error: phoneError } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', identifier)
    .single();
  
  if (phoneData) return phoneData;

  // If not found by phone, try email
  const { data: emailData, error: emailError } = await supabase
    .from('customers')
    .select('*')
    .eq('email', identifier)
    .single();
  
  if (emailData) return emailData;
  
  return null;
};

/**
 * Create a new customer or update an existing one
 */
export const createOrUpdateCustomer = async (customer: Customer): Promise<Customer | null> => {
  // Check if customer exists by phone or email
  let existingCustomer = null;
  
  if (customer.phone) {
    existingCustomer = await findCustomer(customer.phone);
  } else if (customer.email) {
    existingCustomer = await findCustomer(customer.email);
  }
  
  const now = new Date().toISOString();
  
  if (existingCustomer) {
    // Update existing customer
    const { data, error } = await supabase
      .from('customers')
      .update({
        name: customer.name || existingCustomer.name,
        email: customer.email || existingCustomer.email,
        last_visit: now
      })
      .eq('id', existingCustomer.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating customer:', error);
      return null;
    }
    
    return data;
  } else {
    // Create new customer
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        last_visit: now,
        created_at: now
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating customer:', error);
      return null;
    }
    
    return data;
  }
};
