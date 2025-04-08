
import { supabase } from "@/integrations/supabase/client";

/**
 * Enable real-time updates for the invoices table.
 * Call this function during application initialization.
 */
export const enableRealtimeForInvoices = async (): Promise<void> => {
  try {
    // Instead of using RPC, use the REST API directly
    const { data: publications, error: pubError } = await supabase
      .from('pg_publication')
      .select('*')
      .eq('name', 'supabase_realtime');

    if (pubError) {
      console.error('Error checking realtime publications:', pubError);
      return;
    }

    // Check if publication exists
    const publicationExists = publications && publications.length > 0;

    // Enable realtime for invoices table
    console.log('Enabling realtime for invoices table...');
    
    // Execute ALTER query to enable REPLICA IDENTITY FULL on invoices table
    const { error: alterError } = await supabase.rpc(
      'execute_sql',
      {
        query: 'ALTER TABLE invoices REPLICA IDENTITY FULL;'
      }
    );
    
    if (alterError) {
      console.error('Error setting REPLICA IDENTITY FULL:', alterError);
    }
    
    // Add table to publication
    const { error: addError } = await supabase.rpc(
      'execute_sql',
      {
        query: `
          INSERT INTO pg_publication_tables (pubname, schemaname, tablename)
          VALUES ('supabase_realtime', 'public', 'invoices')
          ON CONFLICT (pubname, schemaname, tablename) DO NOTHING;
        `
      }
    );
    
    if (addError) {
      console.error('Error adding table to publication:', addError);
    } else {
      console.log('Realtime enabled for invoices table');
    }
  } catch (error) {
    console.error('Error enabling realtime for invoices table:', error);
  }
};
