
import { supabase } from '@/integrations/supabase/client';
import { Invoice, InvoiceItem, generateInvoiceNumber, calculateTax, TABLES } from './types';
import { Order } from '../order/types';

// Create a new invoice with items
export const createInvoice = async (
  data: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at' | 'items'>,
  items: Omit<InvoiceItem, 'id' | 'invoice_id'>[]
): Promise<{ invoice: Invoice | null; error: string | null }> => {
  try {
    console.log('Creating invoice:', data);
    console.log('Invoice items:', items);
    
    // Check authentication
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      console.error('Authentication error:', authError);
      return { invoice: null, error: 'Authentication error: You must be logged in to create an invoice' };
    }
    
    // Generate a unique invoice number
    const invoiceNumber = generateInvoiceNumber(data.restaurant_id);
    
    // Validate customer_id and order_id - if provided they should be valid UUIDs
    const validatedData = {
      ...data,
      customer_id: data.customer_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(data.customer_id) ? data.customer_id : null,
      order_id: data.order_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(data.order_id) ? data.order_id : null,
      // Adding user_id for RLS policies
      user_id: userData.user.id
    };
    
    // Insert the invoice into the database
    const { data: invoiceData, error: invoiceError } = await supabase
      .from(TABLES.INVOICES)
      .insert({
        invoice_number: invoiceNumber,
        order_id: validatedData.order_id,
        restaurant_id: validatedData.restaurant_id,
        customer_id: validatedData.customer_id,
        customer_name: validatedData.customer_name,
        total_amount: validatedData.total_amount,
        tax_amount: validatedData.tax_amount,
        discount_amount: validatedData.discount_amount,
        final_amount: validatedData.final_amount,
        status: validatedData.status,
        notes: validatedData.notes,
        payment_method: validatedData.payment_method,
        payment_reference: validatedData.payment_reference,
        user_id: validatedData.user_id, // Added user_id for RLS
      })
      .select()
      .single();
    
    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      return { invoice: null, error: `Database error: ${invoiceError.message || 'Failed to create invoice'}` };
    }
    
    // Insert the invoice items
    const invoiceItems = items.map(item => ({
      invoice_id: invoiceData.id,
      name: item.name,
      description: item.description || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      tax_percentage: item.tax_percentage || 0,
      discount_percentage: item.discount_percentage || 0
    }));
    
    const { data: itemsData, error: itemsError } = await supabase
      .from(TABLES.INVOICE_ITEMS)
      .insert(invoiceItems)
      .select();
    
    if (itemsError) {
      console.error('Error creating invoice items:', itemsError);
      // Attempt to delete the invoice if items fail
      await supabase.from(TABLES.INVOICES).delete().eq('id', invoiceData.id);
      return { invoice: null, error: `Database error: ${itemsError.message || 'Failed to create invoice items'}` };
    }
    
    // Construct the full invoice object to return, ensuring the status is properly typed
    const invoice: Invoice = {
      ...invoiceData,
      status: invoiceData.status as Invoice['status'],
      items: itemsData as InvoiceItem[]
    };
    
    return { invoice, error: null };
  } catch (error: any) {
    console.error('Error in createInvoice:', error);
    return { invoice: null, error: `Unexpected error: ${error?.message || 'An unknown error occurred'}` };
  }
};

// Create an invoice from an order
export const createInvoiceFromOrder = async (order: Order): Promise<{ invoice: Invoice | null; error: string | null }> => {
  try {
    console.log('Creating invoice from order:', order);
    
    // Check if invoice already exists for this order
    const { data: existingInvoice } = await supabase
      .from(TABLES.INVOICES)
      .select('*')
      .eq('order_id', order.id)
      .maybeSingle();
    
    if (existingInvoice) {
      console.log('Invoice already exists for this order');
      // Fetch invoice items
      const { data: items } = await supabase
        .from(TABLES.INVOICE_ITEMS)
        .select('*')
        .eq('invoice_id', existingInvoice.id);
      
      return { 
        invoice: {
          ...existingInvoice,
          status: existingInvoice.status as Invoice['status'],
          items: items || []
        } as Invoice,
        error: null
      };
    }
    
    const orderItems = order.items || [];
    
    // Calculate totals
    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = calculateTax(totalAmount);
    const discountAmount = 0; // No discount for now
    const finalAmount = totalAmount + taxAmount - discountAmount;
    
    // Create invoice items
    const invoiceItems: Omit<InvoiceItem, 'id' | 'invoice_id'>[] = orderItems.map(item => ({
      name: item.name,
      description: item.special_instructions || '',
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      tax_percentage: 5, // Default 5% GST
      discount_percentage: 0 // No discount for now
    }));
    
    // Create the invoice
    const invoiceData: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at' | 'items'> = {
      order_id: order.id || '',
      restaurant_id: order.restaurant_id || '',
      customer_id: order.customer_id,
      customer_name: order.customer_name || 'Guest Customer',
      total_amount: totalAmount,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      status: 'issued',
      notes: order.special_instructions || order.notes || '',
      payment_method: order.payment_method,
      payment_reference: order.payment_reference
    };
    
    return await createInvoice(invoiceData, invoiceItems);
  } catch (error: any) {
    console.error('Error in createInvoiceFromOrder:', error);
    return { invoice: null, error: `Unexpected error: ${error?.message || 'An unknown error occurred'}` };
  }
};
