export * from './types';
export * from './createInvoice';
export * from './getInvoices';
export * from './updateInvoice';

// Modified to use direct Supabase channel subscription instead of custom RPC function
export const enableRealtimeForInvoices = async (): Promise<void> => {
  console.log('Setting up realtime for invoices table...');
  // With client-side Supabase library, we don't need to do any backend setup here
  // Real-time functionality is handled directly in the useInvoices hook through channel subscriptions
  return Promise.resolve();
};
