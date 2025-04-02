
import { supabase } from '@/integrations/supabase/client';
import { Invoice, InvoiceItem, generateInvoiceNumber, calculateTax } from './types';
import { Order } from '../order/types';

// Create a new invoice with items
// This is a mock implementation until we have the actual database tables
export const createInvoice = async (
  data: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at' | 'items'>,
  items: Omit<InvoiceItem, 'id' | 'invoice_id'>[]
): Promise<Invoice | null> => {
  try {
    console.log('Creating invoice:', data);
    console.log('Invoice items:', items);
    
    // Generate a unique invoice number
    const invoiceNumber = generateInvoiceNumber(data.restaurant_id);
    
    // Create a mock invoice for now
    const invoice: Invoice = {
      id: `mock-${Date.now()}`,
      invoice_number: invoiceNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
      items: items.map((item, index) => ({
        id: `mock-item-${Date.now()}-${index}`,
        invoice_id: `mock-${Date.now()}`,
        ...item
      }))
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
    // For now, just return a mock invoice
    const orderItems = order.items || [];
    
    // Calculate totals
    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = calculateTax(totalAmount);
    const discountAmount = 0; // No discount for now
    const finalAmount = totalAmount + taxAmount - discountAmount;
    
    // Create invoice items
    const invoiceItems: Omit<InvoiceItem, 'id' | 'invoice_id'>[] = orderItems.map(item => ({
      name: item.name,
      description: item.notes || '',
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
      notes: order.special_instructions
    };
    
    return createInvoice(invoiceData, invoiceItems);
  } catch (error) {
    console.error('Error in createInvoiceFromOrder:', error);
    return null;
  }
};
