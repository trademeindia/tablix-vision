
import { supabase } from '@/integrations/supabase/client';
import { Invoice, InvoiceItem, TABLES, ensureInvoiceProperties } from './types';

// Get all invoices for a restaurant
export const getRestaurantInvoices = async (restaurantId: string): Promise<Invoice[]> => {
  try {
    console.log('Fetching restaurant invoices:', restaurantId);
    
    // Get all invoices for the restaurant
    const { data: invoices, error } = await supabase
      .from(TABLES.INVOICES)
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching restaurant invoices:', error);
      return [];
    }
    
    // Get invoice items for all invoices
    const invoiceIds = invoices.map(inv => inv.id);
    let items: InvoiceItem[] = [];
    
    if (invoiceIds.length > 0) {
      const { data: invoiceItems, error: itemsError } = await supabase
        .from(TABLES.INVOICE_ITEMS)
        .select('*')
        .in('invoice_id', invoiceIds);
      
      if (itemsError) {
        console.error('Error fetching invoice items:', itemsError);
        return [];
      }
      
      items = invoiceItems || [];
    }
    
    // Construct full invoice objects with items
    const fullInvoices = invoices.map(inv => {
      const invoiceItems = items.filter(item => item.invoice_id === inv.id);
      return {
        ...inv,
        status: inv.status as Invoice['status'],
        items: invoiceItems
      };
    });
    
    return fullInvoices as Invoice[];
  } catch (error) {
    console.error('Error in getRestaurantInvoices:', error);
    return [];
  }
};

// Get a single invoice by ID
export const getInvoiceById = async (invoiceId: string): Promise<Invoice | null> => {
  try {
    // Get the invoice
    const { data: invoice, error } = await supabase
      .from(TABLES.INVOICES)
      .select('*')
      .eq('id', invoiceId)
      .single();
    
    if (error) {
      console.error('Error fetching invoice:', error);
      return null;
    }
    
    // Get the invoice items
    const { data: items, error: itemsError } = await supabase
      .from(TABLES.INVOICE_ITEMS)
      .select('*')
      .eq('invoice_id', invoiceId);
    
    if (itemsError) {
      console.error('Error fetching invoice items:', itemsError);
      return null;
    }
    
    // Construct the full invoice object
    const fullInvoice: Invoice = {
      ...invoice,
      status: invoice.status as Invoice['status'],
      items: items || []
    };
    
    return fullInvoice;
  } catch (error) {
    console.error('Error in getInvoiceById:', error);
    return null;
  }
};

// Get all invoices for a specific order
export const getInvoicesByOrderId = async (orderId: string): Promise<Invoice[]> => {
  try {
    // Get all invoices for the order
    const { data: invoices, error } = await supabase
      .from(TABLES.INVOICES)
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching order invoices:', error);
      return [];
    }
    
    // Get invoice items for all invoices
    const invoiceIds = invoices.map(inv => inv.id);
    let items: InvoiceItem[] = [];
    
    if (invoiceIds.length > 0) {
      const { data: invoiceItems, error: itemsError } = await supabase
        .from(TABLES.INVOICE_ITEMS)
        .select('*')
        .in('invoice_id', invoiceIds);
      
      if (itemsError) {
        console.error('Error fetching invoice items:', itemsError);
        return [];
      }
      
      items = invoiceItems || [];
    }
    
    // Construct full invoice objects with items
    const fullInvoices = invoices.map(inv => {
      const invoiceItems = items.filter(item => item.invoice_id === inv.id);
      return {
        ...inv,
        status: inv.status as Invoice['status'],
        items: invoiceItems
      };
    });
    
    return fullInvoices as Invoice[];
  } catch (error) {
    console.error('Error in getInvoicesByOrderId:', error);
    return [];
  }
};

// Get all invoices for a specific customer
export const getInvoicesByCustomerId = async (customerId: string): Promise<Invoice[]> => {
  try {
    // Get all invoices for the customer
    const { data: invoices, error } = await supabase
      .from(TABLES.INVOICES)
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching customer invoices:', error);
      return [];
    }
    
    // Get invoice items for all invoices
    const invoiceIds = invoices.map(inv => inv.id);
    let items: InvoiceItem[] = [];
    
    if (invoiceIds.length > 0) {
      const { data: invoiceItems, error: itemsError } = await supabase
        .from(TABLES.INVOICE_ITEMS)
        .select('*')
        .in('invoice_id', invoiceIds);
      
      if (itemsError) {
        console.error('Error fetching invoice items:', itemsError);
        return [];
      }
      
      items = invoiceItems || [];
    }
    
    // Construct full invoice objects with items
    const fullInvoices = invoices.map(inv => {
      const invoiceItems = items.filter(item => item.invoice_id === inv.id);
      return {
        ...inv,
        status: inv.status as Invoice['status'],
        items: invoiceItems
      };
    });
    
    return fullInvoices as Invoice[];
  } catch (error) {
    console.error('Error in getInvoicesByCustomerId:', error);
    return [];
  }
};
