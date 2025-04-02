
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
    console.log(`Updating invoice ${invoiceId} status to ${status}`);
    
    // Update the invoice data
    const updateData: Partial<Invoice> = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    if (status === 'paid') {
      updateData.payment_method = paymentMethod || 'cash';
      updateData.payment_reference = paymentReference || null;
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
    console.log(`Updating invoice ${invoiceId}`, updates);
    
    // Update the invoice data with the updated_at timestamp
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('invoices')
      .update(updateData)
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

/**
 * Update invoice items
 */
export const updateInvoiceItems = async (
  invoiceId: string,
  items: Array<Partial<Omit<Invoice['items'][0], 'id' | 'invoice_id'>> & { id: string }>
): Promise<boolean> => {
  try {
    console.log(`Updating items for invoice ${invoiceId}`, items);
    
    // Start a transaction by using a batch update
    const updatePromises = items.map(item => {
      const { id, ...updateData } = item;
      return supabase
        .from('invoice_items')
        .update(updateData)
        .eq('id', id)
        .eq('invoice_id', invoiceId);
    });
    
    const results = await Promise.all(updatePromises);
    
    // Check if any updates failed
    const failed = results.some(result => result.error);
    
    if (failed) {
      console.error('Some invoice items failed to update:', 
        results.filter(r => r.error).map(r => r.error));
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateInvoiceItems:', error);
    return false;
  }
};
