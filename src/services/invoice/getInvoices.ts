
import { supabase } from '@/integrations/supabase/client';
import { Invoice, ensureInvoiceProperties } from './types';

/**
 * Get an invoice by ID
 */
export const getInvoiceById = async (invoiceId: string): Promise<Invoice | null> => {
  try {
    console.log('Fetching invoice by ID:', invoiceId);
    
    // Get the invoice
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching invoice:', error);
      return null;
    }
    
    if (!invoice) {
      console.log('Invoice not found');
      return null;
    }
    
    // Get the invoice items
    const { data: items, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId);
    
    if (itemsError) {
      console.error('Error fetching invoice items:', itemsError);
      return null;
    }
    
    return {
      ...invoice,
      items: items || []
    };
  } catch (error) {
    console.error('Error in getInvoiceById:', error);
    return null;
  }
};

/**
 * Get all invoices for a restaurant
 */
export const getRestaurantInvoices = async (restaurantId: string): Promise<Invoice[]> => {
  try {
    console.log('Fetching restaurant invoices:', restaurantId);
    
    // Get all invoices for the restaurant
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
    
    // For each invoice, get its items
    const invoicesWithItems = await Promise.all(
      invoices.map(async (invoice) => {
        const { data: items, error: itemsError } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoice.id);
        
        if (itemsError) {
          console.error(`Error fetching items for invoice ${invoice.id}:`, itemsError);
          return {
            ...invoice,
            items: []
          };
        }
        
        return {
          ...invoice,
          items: items || []
        };
      })
    );
    
    return invoicesWithItems;
  } catch (error) {
    console.error('Error in getRestaurantInvoices:', error);
    return [];
  }
};

/**
 * Get invoices for a customer
 */
export const getCustomerInvoices = async (customerId: string): Promise<Invoice[]> => {
  try {
    console.log('Fetching customer invoices:', customerId);
    
    // Get all invoices for the customer
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching customer invoices:', error);
      return [];
    }
    
    // For each invoice, get its items
    const invoicesWithItems = await Promise.all(
      invoices.map(async (invoice) => {
        const { data: items, error: itemsError } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoice.id);
        
        if (itemsError) {
          console.error(`Error fetching items for invoice ${invoice.id}:`, itemsError);
          return {
            ...invoice,
            items: []
          };
        }
        
        return {
          ...invoice,
          items: items || []
        };
      })
    );
    
    return invoicesWithItems;
  } catch (error) {
    console.error('Error in getCustomerInvoices:', error);
    return [];
  }
};

/**
 * Get invoice for a specific order
 */
export const getInvoiceByOrderId = async (orderId: string): Promise<Invoice | null> => {
  try {
    console.log('Fetching invoice for order:', orderId);
    
    // Get the invoice
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching invoice by order ID:', error);
      return null;
    }
    
    if (!invoice) {
      console.log('No invoice found for order');
      return null;
    }
    
    // Get the invoice items
    const { data: items, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoice.id);
    
    if (itemsError) {
      console.error('Error fetching invoice items:', itemsError);
      return null;
    }
    
    return {
      ...invoice,
      items: items || []
    };
  } catch (error) {
    console.error('Error in getInvoiceByOrderId:', error);
    return null;
  }
};
