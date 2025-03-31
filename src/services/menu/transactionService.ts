
import { supabase } from "@/integrations/supabase/client";

/**
 * Configuration for transaction service retries
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 500,
  backoffFactor: 1.5
};

/**
 * Service for managing database transactions
 */
export const transactionService = {
  /**
   * Begin a transaction with retry logic
   */
  beginTransaction: async () => {
    let retries = 0;
    let delay = RETRY_CONFIG.initialDelayMs;
    
    // Get the client's session before entering the retry loop to avoid multiple auth calls
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error('Authentication required to begin transaction:', sessionError);
      throw new Error('Authentication required to begin transaction');
    }
    
    const accessToken = sessionData.session.access_token;
    const supabaseUrl = 'https://qofbpjdbmisyxysfcyeb.supabase.co/functions/v1';

    while (retries <= RETRY_CONFIG.maxRetries) {
      try {
        const response = await fetch(`${supabaseUrl}/database-transactions/begin_transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to begin transaction: ${response.status} ${errorText}`);
        }
        
        return await response.json();
      } catch (error) {
        retries++;
        
        // If we've hit max retries, throw the error
        if (retries > RETRY_CONFIG.maxRetries) {
          console.error(`Failed to begin transaction after ${RETRY_CONFIG.maxRetries} retries:`, error);
          throw error;
        }
        
        // Log the retry attempt
        console.warn(`Transaction begin failed (attempt ${retries}/${RETRY_CONFIG.maxRetries}), retrying in ${delay}ms...`, error);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Increase delay for next retry (exponential backoff)
        delay = delay * RETRY_CONFIG.backoffFactor;
      }
    }
    
    // This should never be reached due to the throw inside the loop
    throw new Error('Failed to begin transaction');
  },
  
  /**
   * Commit a transaction with retry logic
   */
  commitTransaction: async () => {
    let retries = 0;
    let delay = RETRY_CONFIG.initialDelayMs;
    
    // Get the client's session before entering the retry loop to avoid multiple auth calls
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error('Authentication required to commit transaction:', sessionError);
      throw new Error('Authentication required to commit transaction');
    }
    
    const accessToken = sessionData.session.access_token;
    const supabaseUrl = 'https://qofbpjdbmisyxysfcyeb.supabase.co/functions/v1';

    while (retries <= RETRY_CONFIG.maxRetries) {
      try {
        const response = await fetch(`${supabaseUrl}/database-transactions/commit_transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to commit transaction: ${response.status} ${errorText}`);
        }
        
        return await response.json();
      } catch (error) {
        retries++;
        
        // If we've hit max retries, throw the error
        if (retries > RETRY_CONFIG.maxRetries) {
          console.error(`Failed to commit transaction after ${RETRY_CONFIG.maxRetries} retries:`, error);
          throw error;
        }
        
        // Log the retry attempt
        console.warn(`Transaction commit failed (attempt ${retries}/${RETRY_CONFIG.maxRetries}), retrying in ${delay}ms...`, error);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Increase delay for next retry (exponential backoff)
        delay = delay * RETRY_CONFIG.backoffFactor;
      }
    }
    
    // This should never be reached due to the throw inside the loop
    throw new Error('Failed to commit transaction');
  },
  
  /**
   * Rollback a transaction with retry logic
   */
  rollbackTransaction: async () => {
    let retries = 0;
    let delay = RETRY_CONFIG.initialDelayMs;
    
    // Get the client's session before entering the retry loop to avoid multiple auth calls
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error('Authentication required to rollback transaction:', sessionError);
      throw new Error('Authentication required to rollback transaction');
    }
    
    const accessToken = sessionData.session.access_token;
    const supabaseUrl = 'https://qofbpjdbmisyxysfcyeb.supabase.co/functions/v1';

    while (retries <= RETRY_CONFIG.maxRetries) {
      try {
        const response = await fetch(`${supabaseUrl}/database-transactions/rollback_transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to rollback transaction: ${response.status} ${errorText}`);
        }
        
        return await response.json();
      } catch (error) {
        retries++;
        
        // If we've hit max retries, throw the error
        if (retries > RETRY_CONFIG.maxRetries) {
          console.error(`Failed to rollback transaction after ${RETRY_CONFIG.maxRetries} retries:`, error);
          throw error;
        }
        
        // For rollbacks, we may want to continue retrying since it's important to release locks
        // Log the retry attempt
        console.warn(`Transaction rollback failed (attempt ${retries}/${RETRY_CONFIG.maxRetries}), retrying in ${delay}ms...`, error);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Increase delay for next retry (exponential backoff)
        delay = delay * RETRY_CONFIG.backoffFactor;
      }
    }
    
    // This should never be reached due to the throw inside the loop
    throw new Error('Failed to rollback transaction');
  }
};
