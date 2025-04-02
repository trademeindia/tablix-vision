
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errorHandling";

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
    
    // Try to get the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      return handleError(
        sessionError || new Error('Authentication required to begin transaction'),
        { category: 'auth' }
      );
    }
    
    const accessToken = sessionData.session.access_token;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qofbpjdbmisyxysfcyeb.supabase.co';
    const functionUrl = `${supabaseUrl}/functions/v1/database-transactions/begin_transaction`;

    while (retries <= RETRY_CONFIG.maxRetries) {
      try {
        const response = await fetch(functionUrl, {
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
          return handleError(error, { 
            context: 'beginTransaction',
            category: 'database',
            fallbackMessage: `Failed to begin transaction after ${RETRY_CONFIG.maxRetries} retries`
          });
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
    return handleError(new Error('Failed to begin transaction'), { 
      category: 'database' 
    });
  },
  
  /**
   * Commit a transaction with retry logic
   */
  commitTransaction: async () => {
    let retries = 0;
    let delay = RETRY_CONFIG.initialDelayMs;
    
    // Try to get the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      return handleError(
        sessionError || new Error('Authentication required to commit transaction'),
        { category: 'auth' }
      );
    }
    
    const accessToken = sessionData.session.access_token;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qofbpjdbmisyxysfcyeb.supabase.co';
    const functionUrl = `${supabaseUrl}/functions/v1/database-transactions/commit_transaction`;

    while (retries <= RETRY_CONFIG.maxRetries) {
      try {
        const response = await fetch(functionUrl, {
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
          return handleError(error, {
            context: 'commitTransaction',
            category: 'database',
            fallbackMessage: `Failed to commit transaction after ${RETRY_CONFIG.maxRetries} retries`
          });
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
    return handleError(new Error('Failed to commit transaction'), { 
      category: 'database' 
    });
  },
  
  /**
   * Rollback a transaction with retry logic
   */
  rollbackTransaction: async () => {
    let retries = 0;
    let delay = RETRY_CONFIG.initialDelayMs;
    
    // Try to get the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      return handleError(
        sessionError || new Error('Authentication required to rollback transaction'),
        { category: 'auth', showToast: false }  // No toast on rollback errors as they're usually in error handlers
      );
    }
    
    const accessToken = sessionData.session.access_token;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qofbpjdbmisyxysfcyeb.supabase.co';
    const functionUrl = `${supabaseUrl}/functions/v1/database-transactions/rollback_transaction`;

    while (retries <= RETRY_CONFIG.maxRetries) {
      try {
        const response = await fetch(functionUrl, {
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
        
        // For rollbacks, we want to continue retrying since it's important to release locks
        if (retries > RETRY_CONFIG.maxRetries) {
          return handleError(error, {
            context: 'rollbackTransaction',
            category: 'database',
            fallbackMessage: `Failed to rollback transaction after ${RETRY_CONFIG.maxRetries} retries`,
            showToast: false  // No toast on rollback errors as they're usually in error handlers
          });
        }
        
        // Log the retry attempt
        console.warn(`Transaction rollback failed (attempt ${retries}/${RETRY_CONFIG.maxRetries}), retrying in ${delay}ms...`, error);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Increase delay for next retry (exponential backoff)
        delay = delay * RETRY_CONFIG.backoffFactor;
      }
    }
    
    // This should never be reached due to the throw inside the loop
    return handleError(new Error('Failed to rollback transaction'), { 
      category: 'database',
      showToast: false  // No toast on rollback errors as they're usually in error handlers
    });
  }
};
