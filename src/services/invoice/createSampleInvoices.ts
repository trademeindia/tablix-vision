
import { supabase } from '@/integrations/supabase/client';
import { Invoice, generateInvoiceNumber, TABLES } from './types';

// Create sample invoices for testing
export const createSampleInvoices = async (restaurantId: string): Promise<boolean> => {
  try {
    // Check authentication
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      console.error('Authentication error:', authError);
      return false;
    }
    
    // Sample invoices data with more varied examples
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
      },
      {
        invoice_number: generateInvoiceNumber(restaurantId),
        restaurant_id: restaurantId,
        customer_name: 'Priya Sharma',
        total_amount: 235.75,
        tax_amount: 11.79,
        discount_amount: 20.00,
        final_amount: 227.54,
        status: 'paid',
        notes: 'Corporate event',
        payment_method: 'Bank Transfer',
        payment_reference: 'TRFR-78952',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
      },
      {
        invoice_number: generateInvoiceNumber(restaurantId),
        restaurant_id: restaurantId,
        customer_name: 'David Wilson',
        total_amount: 78.50,
        tax_amount: 3.93,
        discount_amount: 0,
        final_amount: 82.43,
        status: 'issued',
        notes: 'Family dinner',
        created_at: new Date(Date.now() - 86400000 * 4).toISOString() // 4 days ago
      },
      {
        invoice_number: generateInvoiceNumber(restaurantId),
        restaurant_id: restaurantId,
        customer_name: 'Alex Morgan',
        total_amount: 55.25,
        tax_amount: 2.76,
        discount_amount: 10.00,
        final_amount: 48.01,
        status: 'cancelled',
        notes: 'Order cancelled by customer',
        created_at: new Date(Date.now() - 86400000 * 1.5).toISOString() // 1.5 days ago
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
    
    // Menu items with prices for more realistic invoice items
    const menuItems = [
      { name: 'Margherita Pizza', price: 15.99, description: 'Classic cheese and tomato pizza' },
      { name: 'Caesar Salad', price: 8.95, description: 'Romaine lettuce, croutons, parmesan' },
      { name: 'Grilled Salmon', price: 24.50, description: 'Fresh salmon with lemon herb sauce' },
      { name: 'Chicken Tikka Masala', price: 18.75, description: 'Spicy chicken curry with rice' },
      { name: 'Vegetable Risotto', price: 14.50, description: 'Creamy arborio rice with seasonal vegetables' },
      { name: 'Beef Burger', price: 16.95, description: 'House special burger with fries' },
      { name: 'Pasta Carbonara', price: 14.95, description: 'Classic Italian pasta with bacon and egg' },
      { name: 'House Wine (Glass)', price: 9.00, description: 'Selection of red or white wine' },
      { name: 'Chocolate Mousse', price: 7.50, description: 'Rich chocolate dessert' },
      { name: 'Cheesecake', price: 8.95, description: 'New York style cheesecake' },
      { name: 'Espresso', price: 3.50, description: 'Double shot espresso' },
      { name: 'Garlic Bread', price: 5.95, description: 'Oven baked with melted cheese' }
    ];
    
    for (const invoice of invoices) {
      // Generate 2-4 items per invoice
      const numItems = Math.floor(Math.random() * 3) + 2;
      
      // Create a copy of the menuItems array to avoid duplicates
      const availableItems = [...menuItems];
      
      // Randomly select items for this invoice
      for (let i = 0; i < numItems; i++) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        const menuItem = availableItems.splice(randomIndex, 1)[0]; // Remove the selected item
        
        const quantity = Math.floor(Math.random() * 2) + 1;
        
        sampleItems.push({
          invoice_id: invoice.id,
          name: menuItem.name,
          description: menuItem.description,
          quantity: quantity,
          unit_price: menuItem.price,
          total_price: menuItem.price * quantity,
          tax_percentage: 5,
          discount_percentage: i === 0 ? 10 : 0 // Apply discount to first item only
        });
      }
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
