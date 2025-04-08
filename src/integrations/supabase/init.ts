
import { enableRealtimeForInvoices } from '@/services/invoice';

/**
 * Initialize Supabase integrations when the app starts
 */
export const initSupabase = async (): Promise<void> => {
  try {
    // Enable realtime for necessary tables
    // For demo/development purposes, we're initializing without a specific restaurant ID
    // In a production app, this would come from authentication context
    const restaurantId = '123e4567-e89b-12d3-a456-426614174000'; // Default mock restaurant ID
    await enableRealtimeForInvoices(restaurantId);
  } catch (error) {
    console.error('Error initializing Supabase integrations:', error);
  }
};
