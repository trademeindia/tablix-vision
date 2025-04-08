
import { supabase } from "@/integrations/supabase/client";

/**
 * Enable real-time updates for the invoices table.
 * Call this function during application initialization.
 */
export const enableRealtimeForInvoices = async (): Promise<void> => {
  try {
    // Check if the table is already in the realtime publication
    const { data: publications, error: pubError } = await supabase.rpc(
      'supabase_functions.http_request',
      {
        method: 'GET',
        url: '/rest/v1/realtime/publications',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        },
      }
    );

    if (pubError) {
      console.error('Error checking realtime publications:', pubError);
      return;
    }

    // Check if supabase_realtime publication exists and if invoices table is included
    const publicationExists = publications && Array.isArray(publications) && 
      publications.some((pub: any) => 
        pub.name === 'supabase_realtime' && 
        pub.tables && 
        pub.tables.includes('invoices')
      );

    if (!publicationExists) {
      console.log('Enabling realtime for invoices table...');
      
      // Add invoices table to supabase_realtime publication if it's not already included
      await supabase.rpc('supabase_functions.http_request', {
        method: 'POST',
        url: '/rest/v1/realtime/enable',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        },
        body: JSON.stringify({
          table: 'invoices',
        }),
      });
      
      console.log('Realtime enabled for invoices table');
    } else {
      console.log('Realtime already enabled for invoices table');
    }
  } catch (error) {
    console.error('Error enabling realtime for invoices table:', error);
  }
};
