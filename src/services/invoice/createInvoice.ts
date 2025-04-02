
import { supabase } from '@/integrations/supabase/client';
import { Invoice, InvoiceItem, generateInvoiceNumber, calculateTax, TABLES } from './types';
import { Order } from '../order/types';

// Create a new invoice with items
export const createInvoice = async (
  data: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at' | 'items'>,
  items: Omit<InvoiceItem, 'id' | 'invoice_id'>[]
): Promise<Invoice | null> => {
  try {
    console.log('Creating invoice:', data);
    console.log('Invoice items:', items);
    
    // Generate a unique invoice number
    const invoiceNumber = generateInvoiceNumber(data.restaurant_id);
    
    // Insert the invoice into the database
    const { data: invoiceData, error: invoiceError } = await supabase
      .from(TABLES.INVOICES)
      .insert({
        invoice_number: invoiceNumber,
        order_id: data.order_id,
        restaurant_id: data.restaurant_id,
        customer_id: data.customer_id,
        customer_name: data.customer_name,
        total_amount: data.total_amount,
        tax_amount: data.tax_amount,
        discount_amount: data.discount_amount,
        final_amount: data.final_amount,
        status: data.status,
        notes: data.notes,
        payment_method: data.payment_method,
        payment_reference: data.payment_reference
      })
      .select()
      .single();
    
    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      return null;
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
      return null;
    }
    
    // Construct the full invoice object to return
    const invoice: Invoice = {
      ...invoiceData,
      items: itemsData as InvoiceItem[]
    };
    
    return invoice;
  } catch (error) {
    console.error('Error in createInvoice:', error);
    return null;
  }
};

// Create an invoice from an order
export const createInvoiceFromOrder = async (order: Order): Promise<Invoice | null> => {
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
        ...existingInvoice,
        items: items || []
      } as Invoice;
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
      notes: order.special_instructions || order.notes || ''
    };
    
    return createInvoice(invoiceData, invoiceItems);
  } catch (error) {
    console.error('Error in createInvoiceFromOrder:', error);
    return null;
  }
};
