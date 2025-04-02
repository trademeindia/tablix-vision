
import { supabase } from '@/integrations/supabase/client';
import { Invoice, InvoiceItem, generateInvoiceNumber, calculateTax } from './types';
import { Order } from '../order/types';

/**
 * Create a new invoice from an order
 */
export const createInvoiceFromOrder = async (
  order: Order,
  taxRate: number = 5,
  discount: number = 0
): Promise<Invoice | null> => {
  try {
    // Generate a unique invoice number
    const invoiceNumber = generateInvoiceNumber(order.restaurant_id);
    
    // Calculate tax and final amount
    const subtotal = order.total_amount;
    const taxAmount = calculateTax(subtotal, taxRate);
    const discountAmount = (subtotal * discount) / 100;
    const finalAmount = subtotal + taxAmount - discountAmount;

    // Create invoice header
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        order_id: order.id,
        invoice_number: invoiceNumber,
        restaurant_id: order.restaurant_id,
        customer_id: order.customer_id || null,
        customer_name: order.customer_id ? undefined : (order.customer_name || 'Guest'),
        total_amount: subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        status: 'issued',
        notes: order.notes || null,
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      return null;
    }

    // Create invoice items from order items
    const invoiceItems: InvoiceItem[] = order.items.map(item => ({
      invoice_id: invoiceData.id,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems)
      .select();

    if (itemsError) {
      console.error('Error creating invoice items:', itemsError);
      return null;
    }

    // Update order with invoice reference
    await supabase
      .from('orders')
      .update({ invoice_id: invoiceData.id })
      .eq('id', order.id);

    return {
      ...invoiceData,
      items: itemsData,
    };
  } catch (error) {
    console.error('Error in createInvoiceFromOrder:', error);
    return null;
  }
};

/**
 * Create a new invoice directly
 */
export const createInvoice = async (
  invoice: {
    order_id?: string;
    restaurant_id: string;
    customer_id?: string;
    customer_name?: string;
    total_amount: number;
    tax_rate?: number;
    discount_percentage?: number;
    notes?: string;
    items: Array<{
      name: string;
      description?: string;
      quantity: number;
      unit_price: number;
      tax_percentage?: number;
      discount_percentage?: number;
    }>;
  }
): Promise<Invoice | null> => {
  try {
    const invoiceNumber = generateInvoiceNumber(invoice.restaurant_id);
    const taxRate = invoice.tax_rate || 5;
    const discountPercentage = invoice.discount_percentage || 0;
    
    const subtotal = invoice.total_amount;
    const taxAmount = calculateTax(subtotal, taxRate);
    const discountAmount = (subtotal * discountPercentage) / 100;
    const finalAmount = subtotal + taxAmount - discountAmount;

    // Create invoice header
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        order_id: invoice.order_id || null,
        invoice_number: invoiceNumber,
        restaurant_id: invoice.restaurant_id,
        customer_id: invoice.customer_id || null,
        customer_name: invoice.customer_name || null,
        total_amount: subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        status: 'issued',
        notes: invoice.notes || null,
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      return null;
    }

    // Create invoice items
    const invoiceItems: InvoiceItem[] = invoice.items.map(item => {
      const itemTaxPercentage = item.tax_percentage ?? taxRate;
      const itemDiscountPercentage = item.discount_percentage ?? 0;
      const totalPrice = item.unit_price * item.quantity;
      
      return {
        invoice_id: invoiceData.id,
        name: item.name,
        description: item.description || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: totalPrice,
        tax_percentage: itemTaxPercentage,
        discount_percentage: itemDiscountPercentage,
      };
    });

    const { data: itemsData, error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems)
      .select();

    if (itemsError) {
      console.error('Error creating invoice items:', itemsError);
      return null;
    }

    // If this invoice is linked to an order, update the order with the invoice reference
    if (invoice.order_id) {
      await supabase
        .from('orders')
        .update({ invoice_id: invoiceData.id })
        .eq('id', invoice.order_id);
    }

    return {
      ...invoiceData,
      items: itemsData,
    };
  } catch (error) {
    console.error('Error in createInvoice:', error);
    return null;
  }
};
