import { supabase } from '@/integrations/supabase/client';
import { TABLES } from './types';

/**
 * Delete an invoice and its associated items
 * @param id The invoice ID to delete
 * @returns A boolean indicating whether the operation was successful
 */
export const deleteInvoice = async (id: string): Promise<boolean> => {
  try {
    // Start a transaction by creating a new PostgreSQL connection
    const { data, error } = await supabase.rpc('delete_invoice_with_items', { invoice_id: id });
    
    if (error) {
      console.error('Error deleting invoice with RPC:', error);
      
      // Fall back to manual deletion if RPC fails
      // First delete all associated invoice items
      const { error: itemsError } = await supabase
        .from(TABLES.INVOICE_ITEMS)
        .delete()
        .eq('invoice_id', id);
      
      if (itemsError) {
        console.error('Error deleting invoice items:', itemsError);
        return false;
      }
      
      // Then delete the invoice
      const { error: invoiceError } = await supabase
        .from(TABLES.INVOICES)
        .delete()
        .eq('id', id);
      
      if (invoiceError) {
        console.error('Error deleting invoice:', invoiceError);
        return false;
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteInvoice:', error);
    return false;
  }
};

/**
 * Delete multiple invoices and their associated items
 * @param ids Array of invoice IDs to delete
 * @returns A boolean indicating whether the operation was successful
 */
export const deleteInvoices = async (ids: string[]): Promise<boolean> => {
  try {
    if (!ids.length) return true;
    
    // Delete all associated invoice items first
    const { error: itemsError } = await supabase
      .from(TABLES.INVOICE_ITEMS)
      .delete()
      .in('invoice_id', ids);
    
    if (itemsError) {
      console.error('Error deleting multiple invoice items:', itemsError);
      return false;
    }
    
    // Then delete the invoices
    const { error: invoicesError } = await supabase
      .from(TABLES.INVOICES)
      .delete()
      .in('id', ids);
    
    if (invoicesError) {
      console.error('Error deleting multiple invoices:', invoicesError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteInvoices:', error);
    return false;
  }
}; 