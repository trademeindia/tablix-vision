
import { supabase } from '@/integrations/supabase/client';
import { Invoice, TABLES } from './types';

// Update an invoice
export const updateInvoice = async (
  id: string,
  data: Partial<Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'items'>>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLES.INVOICES)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating invoice:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateInvoice:', error);
    return false;
  }
};

// Update invoice status
export const updateInvoiceStatus = async (
  id: string,
  status: Invoice['status']
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLES.INVOICES)
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating invoice status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateInvoiceStatus:', error);
    return false;
  }
};

// Mark invoice as paid
export const markInvoiceAsPaid = async (
  id: string, 
  paymentMethod?: string, 
  paymentReference?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLES.INVOICES)
      .update({
        status: 'paid',
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error marking invoice as paid:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markInvoiceAsPaid:', error);
    return false;
  }
};

// Mark invoice as cancelled
export const cancelInvoice = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLES.INVOICES)
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error cancelling invoice:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in cancelInvoice:', error);
    return false;
  }
};
