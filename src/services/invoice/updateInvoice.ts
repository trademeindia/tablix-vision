
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from './types';
import { getInvoiceById } from './getInvoices';

// Mock invoices from getInvoices
let mockInvoices: Invoice[] = [];

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
    
    // Get the current invoice data
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) {
      console.error('Invoice not found');
      return false;
    }
    
    // Update the invoice data
    const updateData: Partial<Invoice> = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    if (status === 'paid') {
      updateData.payment_method = paymentMethod || 'cash';
      updateData.payment_reference = paymentReference || null;
    }
    
    // Update the invoice in our mock data
    mockInvoices = mockInvoices.map(inv => 
      inv.id === invoiceId ? { ...inv, ...updateData } : inv
    );
    
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
    
    // Get the current invoice data
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) {
      console.error('Invoice not found');
      return false;
    }
    
    // Update the invoice data with the updated_at timestamp
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Update the invoice in our mock data
    mockInvoices = mockInvoices.map(inv => 
      inv.id === invoiceId ? { ...inv, ...updateData } : inv
    );
    
    return true;
  } catch (error) {
    console.error('Error in updateInvoice:', error);
    return false;
  }
};
