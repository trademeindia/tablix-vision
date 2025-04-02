
import { supabase } from '@/integrations/supabase/client';
import { Invoice, ensureInvoiceProperties } from './types';

/**
 * Get an invoice by ID
 */
export const getInvoiceById = async (invoiceId: string): Promise<Invoice | null> => {
  try {
    // Get the invoice header
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (invoiceError) {
      console.error('Error fetching invoice:', invoiceError);
      return null;
    }

    // Get the invoice items
    const { data: itemsData, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId);

    if (itemsError) {
      console.error('Error fetching invoice items:', itemsError);
      return null;
    }

    return ensureInvoiceProperties(invoiceData, itemsData);
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
    // Get the invoice headers
    const { data: invoicesData, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (invoicesError) {
      console.error('Error fetching restaurant invoices:', invoicesError);
      return [];
    }

    // For each invoice, get the items and combine the data
    const invoices = await Promise.all(
      invoicesData.map(async (invoice) => {
        const { data: itemsData, error: itemsError } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoice.id);

        if (itemsError) {
          console.error('Error fetching invoice items:', itemsError);
          return null;
        }

        return ensureInvoiceProperties(invoice, itemsData);
      })
    );

    return invoices.filter((invoice): invoice is Invoice => invoice !== null);
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
    // Get the invoice headers
    const { data: invoicesData, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (invoicesError) {
      console.error('Error fetching customer invoices:', invoicesError);
      return [];
    }

    // For each invoice, get the items and combine the data
    const invoices = await Promise.all(
      invoicesData.map(async (invoice) => {
        const { data: itemsData, error: itemsError } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoice.id);

        if (itemsError) {
          console.error('Error fetching invoice items:', itemsError);
          return null;
        }

        return ensureInvoiceProperties(invoice, itemsData);
      })
    );

    return invoices.filter((invoice): invoice is Invoice => invoice !== null);
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
    // Get the invoice header
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (invoiceError) {
      console.error('Error fetching invoice for order:', invoiceError);
      return null;
    }

    // Get the invoice items
    const { data: itemsData, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceData.id);

    if (itemsError) {
      console.error('Error fetching invoice items:', itemsError);
      return null;
    }

    return ensureInvoiceProperties(invoiceData, itemsData);
  } catch (error) {
    console.error('Error in getInvoiceByOrderId:', error);
    return null;
  }
};
