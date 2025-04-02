
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from './types';

/**
 * Update invoice status
 */
export const updateInvoiceStatus = async (
  invoiceId: string, 
  status: 'draft' | 'issued' | 'paid' | 'cancelled',
  paymentMethod?: string,
  paymentReference?: string
): Promise<boolean> => {
  try {
    const updateData: any = { status };
    
    if (status === 'paid') {
      updateData.payment_method = paymentMethod || 'cash';
      updateData.payment_reference = paymentReference || null;
      updateData.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', invoiceId);

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

/**
 * Update invoice details
 */
export const updateInvoice = async (
  invoiceId: string,
  updates: Partial<Omit<Invoice, 'id' | 'items'>>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', invoiceId);

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
