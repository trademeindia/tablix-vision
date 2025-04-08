
import { enableRealtimeForInvoices } from '@/services/invoice';

/**
 * Initialize Supabase integrations when the app starts
 */
export const initSupabase = async (): Promise<void> => {
  try {
    // Enable realtime for necessary tables
    await enableRealtimeForInvoices();
  } catch (error) {
    console.error('Error initializing Supabase integrations:', error);
  }
};
