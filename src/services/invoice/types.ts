
import { Order } from '../order/types';

export interface Invoice {
  id?: string;
  order_id: string;
  invoice_number: string;
  restaurant_id: string;
  customer_id?: string;
  customer_name?: string;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  final_amount: number;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  tax_percentage?: number;
  discount_percentage?: number;
}

// Helper function to generate a unique invoice number
export const generateInvoiceNumber = (restaurantId: string): string => {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${dateStr}-${randomStr}`;
};

// Helper function to calculate tax (default 5% GST)
export const calculateTax = (amount: number, taxRate: number = 5): number => {
  return (amount * taxRate) / 100;
};

// Helper function to ensure invoice has required properties
export const ensureInvoiceProperties = (invoiceData: any, itemsData: any[]): Invoice => {
  return {
    ...invoiceData,
    items: itemsData || [],
    status: invoiceData.status as Invoice['status'],
  };
};
