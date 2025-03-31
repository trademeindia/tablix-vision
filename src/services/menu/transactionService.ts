
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing database transactions
 */
export const transactionService = {
  /**
   * Begin a transaction
   */
  beginTransaction: async () => {
    try {
      const supabaseUrl = 'https://qofbpjdbmisyxysfcyeb.supabase.co/functions/v1';
      const response = await fetch(`${supabaseUrl}/database-transactions/begin_transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to begin transaction');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error beginning transaction:', error);
      throw error;
    }
  },
  
  /**
   * Commit a transaction
   */
  commitTransaction: async () => {
    try {
      const supabaseUrl = 'https://qofbpjdbmisyxysfcyeb.supabase.co/functions/v1';
      const response = await fetch(`${supabaseUrl}/database-transactions/commit_transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to commit transaction');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error committing transaction:', error);
      throw error;
    }
  },
  
  /**
   * Rollback a transaction
   */
  rollbackTransaction: async () => {
    try {
      const supabaseUrl = 'https://qofbpjdbmisyxysfcyeb.supabase.co/functions/v1';
      const response = await fetch(`${supabaseUrl}/database-transactions/rollback_transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to rollback transaction');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error rolling back transaction:', error);
      throw error;
    }
  }
};
