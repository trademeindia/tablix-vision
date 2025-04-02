
import { supabase } from '@/integrations/supabase/client';
import { Invoice, ensureInvoiceProperties } from './types';

// Mock invoices for now
let mockInvoices: Invoice[] = [];

/**
 * Get an invoice by ID
 */
export const getInvoiceById = async (invoiceId: string): Promise<Invoice | null> => {
  try {
    console.log('Fetching invoice by ID:', invoiceId);
    
    // Check if we have mock invoices
    if (mockInvoices.length === 0) {
      // Generate some mock data
      generateMockInvoices();
    }
    
    const invoice = mockInvoices.find(inv => inv.id === invoiceId);
    return invoice || null;
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
    
    // If we don't have mock invoices yet, generate them
    if (mockInvoices.length === 0) {
      generateMockInvoices();
    }
    
    return mockInvoices.filter(invoice => invoice.restaurant_id === restaurantId);
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
    
    // If we don't have mock invoices yet, generate them
    if (mockInvoices.length === 0) {
      generateMockInvoices();
    }
    
    return mockInvoices.filter(invoice => invoice.customer_id === customerId);
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
    
    // If we don't have mock invoices yet, generate them
    if (mockInvoices.length === 0) {
      generateMockInvoices();
    }
    
    const invoice = mockInvoices.find(inv => inv.order_id === orderId);
    return invoice || null;
  } catch (error) {
    console.error('Error in getInvoiceByOrderId:', error);
    return null;
  }
};

// Helper function to generate mock invoices
const generateMockInvoices = () => {
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';
  
  mockInvoices = [
    {
      id: 'mock-invoice-1',
      order_id: 'order-1',
      invoice_number: 'INV-230501-0001',
      restaurant_id: restaurantId,
      customer_name: 'John Doe',
      total_amount: 1200,
      tax_amount: 60,
      discount_amount: 0,
      final_amount: 1260,
      status: 'paid',
      payment_method: 'credit_card',
      created_at: '2023-05-01T10:30:00Z',
      updated_at: '2023-05-01T10:45:00Z',
      items: [
        {
          id: 'item-1',
          invoice_id: 'mock-invoice-1',
          name: 'Butter Chicken',
          quantity: 2,
          unit_price: 400,
          total_price: 800,
          tax_percentage: 5
        },
        {
          id: 'item-2',
          invoice_id: 'mock-invoice-1',
          name: 'Garlic Naan',
          quantity: 4,
          unit_price: 100,
          total_price: 400,
          tax_percentage: 5
        }
      ]
    },
    {
      id: 'mock-invoice-2',
      order_id: 'order-2',
      invoice_number: 'INV-230502-0002',
      restaurant_id: restaurantId,
      customer_name: 'Jane Smith',
      total_amount: 850,
      tax_amount: 42.5,
      discount_amount: 50,
      final_amount: 842.5,
      status: 'issued',
      created_at: '2023-05-02T19:20:00Z',
      updated_at: '2023-05-02T19:25:00Z',
      items: [
        {
          id: 'item-3',
          invoice_id: 'mock-invoice-2',
          name: 'Veg Biryani',
          quantity: 1,
          unit_price: 350,
          total_price: 350,
          tax_percentage: 5
        },
        {
          id: 'item-4',
          invoice_id: 'mock-invoice-2',
          name: 'Paneer Tikka',
          quantity: 1,
          unit_price: 300,
          total_price: 300,
          tax_percentage: 5
        },
        {
          id: 'item-5',
          invoice_id: 'mock-invoice-2',
          name: 'Sweet Lassi',
          quantity: 2,
          unit_price: 100,
          total_price: 200,
          tax_percentage: 5
        }
      ]
    },
    {
      id: 'mock-invoice-3',
      order_id: 'order-3',
      invoice_number: 'INV-230503-0003',
      restaurant_id: restaurantId,
      customer_name: 'Robert Johnson',
      total_amount: 1500,
      tax_amount: 75,
      discount_amount: 150,
      final_amount: 1425,
      status: 'cancelled',
      created_at: '2023-05-03T13:10:00Z',
      updated_at: '2023-05-03T13:40:00Z',
      items: [
        {
          id: 'item-6',
          invoice_id: 'mock-invoice-3',
          name: 'Family Feast',
          quantity: 1,
          unit_price: 1500,
          total_price: 1500,
          tax_percentage: 5,
          discount_percentage: 10
        }
      ]
    },
    {
      id: 'mock-invoice-4',
      order_id: 'order-4',
      invoice_number: 'INV-230504-0004',
      restaurant_id: restaurantId,
      customer_name: 'Emily Wilson',
      total_amount: 650,
      tax_amount: 32.5,
      discount_amount: 0,
      final_amount: 682.5,
      status: 'draft',
      created_at: '2023-05-04T17:05:00Z',
      updated_at: '2023-05-04T17:05:00Z',
      items: [
        {
          id: 'item-7',
          invoice_id: 'mock-invoice-4',
          name: 'Vegetable Curry',
          quantity: 1,
          unit_price: 300,
          total_price: 300,
          tax_percentage: 5
        },
        {
          id: 'item-8',
          invoice_id: 'mock-invoice-4',
          name: 'Plain Rice',
          quantity: 1,
          unit_price: 150,
          total_price: 150,
          tax_percentage: 5
        },
        {
          id: 'item-9',
          invoice_id: 'mock-invoice-4',
          name: 'Gulab Jamun',
          quantity: 2,
          unit_price: 100,
          total_price: 200,
          tax_percentage: 5
        }
      ]
    }
  ];
};
