
import { supabase } from '@/integrations/supabase/client';
import { Invoice, generateInvoiceNumber, TABLES } from './types';

// Create a sample invoice for testing
export const createSampleInvoices = async (restaurantId: string): Promise<boolean> => {
  try {
    // Check authentication
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      console.error('Authentication error:', authError);
      return false;
    }
    
    // Sample invoices data
    const sampleInvoices = [
      {
        invoice_number: generateInvoiceNumber(restaurantId),
        restaurant_id: restaurantId,
        customer_name: 'John Smith',
        total_amount: 89.50,
        tax_amount: 4.48,
        discount_amount: 0,
        final_amount: 93.98,
        status: 'paid',
        notes: 'Business dinner',
        payment_method: 'Credit Card',
        payment_reference: 'CARD-123456',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
      },
      {
        invoice_number: generateInvoiceNumber(restaurantId),
        restaurant_id: restaurantId,
        customer_name: 'Maria Garcia',
        total_amount: 42.75,
        tax_amount: 2.14,
        discount_amount: 5.00,
        final_amount: 39.89,
        status: 'paid',
        notes: 'Lunch special',
        payment_method: 'Cash',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
      },
      {
        invoice_number: generateInvoiceNumber(restaurantId),
        restaurant_id: restaurantId,
        customer_name: 'Robert Johnson',
        total_amount: 157.25,
        tax_amount: 7.86,
        discount_amount: 15.00,
        final_amount: 150.11,
        status: 'issued',
        notes: 'Birthday celebration',
        payment_method: 'Pending',
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        invoice_number: generateInvoiceNumber(restaurantId),
        restaurant_id: restaurantId,
        customer_name: 'Emily Chen',
        total_amount: 62.50,
        tax_amount: 3.13,
        discount_amount: 0,
        final_amount: 65.63,
        status: 'draft',
        notes: 'Takeout order',
        created_at: new Date().toISOString() // Today
      }
    ];
    
    // Insert sample invoices
    const { data: invoices, error: invoicesError } = await supabase
      .from(TABLES.INVOICES)
      .insert(sampleInvoices)
      .select();
    
    if (invoicesError) {
      console.error('Error creating sample invoices:', invoicesError);
      return false;
    }
    
    // Create sample invoice items for each invoice
    const sampleItems = [];
    
    for (const invoice of invoices) {
      // Generate 2-4 items per invoice
      const numItems = Math.floor(Math.random() * 3) + 2;
      const menuItems = [
        { name: 'Margherita Pizza', price: 15.99 },
        { name: 'Caesar Salad', price: 8.95 },
        { name: 'Grilled Salmon', price: 24.50 },
        { name: 'Chicken Parmesan', price: 18.75 },
        { name: 'Veggie Burger', price: 12.95 },
        { name: 'Tiramisu', price: 7.50 },
        { name: 'Pasta Carbonara', price: 14.95 },
        { name: 'House Wine (Glass)', price: 9.00 }
      ];
      
      // Randomly select items for this invoice
      const invoiceItems = [];
      for (let i = 0; i < numItems; i++) {
        const randomIndex = Math.floor(Math.random() * menuItems.length);
        const menuItem = menuItems[randomIndex];
        const quantity = Math.floor(Math.random() * 2) + 1;
        
        invoiceItems.push({
          invoice_id: invoice.id,
          name: menuItem.name,
          description: `Fresh ${menuItem.name.toLowerCase()}`,
          quantity: quantity,
          unit_price: menuItem.price,
          total_price: menuItem.price * quantity,
          tax_percentage: 5,
          discount_percentage: i === 0 ? 10 : 0 // Apply discount to first item only
        });
      }
      
      sampleItems.push(...invoiceItems);
    }
    
    // Insert sample invoice items
    const { error: itemsError } = await supabase
      .from(TABLES.INVOICE_ITEMS)
      .insert(sampleItems);
    
    if (itemsError) {
      console.error('Error creating sample invoice items:', itemsError);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error creating sample invoices:', error);
    return false;
  }
};
