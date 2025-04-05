
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DemoAccount {
  email: string;
  password: string;
  role: string;
  name: string;
}

// Demo accounts configuration
export const demoAccounts: DemoAccount[] = [
  {
    email: 'owner@demo.com',
    password: 'demo123',
    role: 'owner',
    name: 'Demo Owner'
  },
  {
    email: 'chef@demo.com',
    password: 'demo123',
    role: 'chef',
    name: 'Demo Chef'
  },
  {
    email: 'waiter@demo.com',
    password: 'demo123',
    role: 'waiter',
    name: 'Demo Waiter'
  },
  {
    email: 'customer@demo.com',
    password: 'demo123',
    role: 'customer',
    name: 'Demo Customer'
  }
];

export const useDemoAccounts = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // This function tries to create all demo accounts at once
  const initializeDemoAccounts = async () => {
    if (isInitializing || isInitialized) return;
    
    setIsInitializing(true);
    setError(null);
    
    try {
      console.log('Initializing demo accounts...');
      
      for (const account of demoAccounts) {
        // First check if account already exists
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: account.email,
          password: account.password
        });
        
        // If account exists and we can login, continue to next account
        if (signInData?.user) {
          console.log(`Demo account ${account.email} already exists`);
          continue;
        }
        
        // Try to create the account
        console.log(`Creating demo account: ${account.email}`);
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: account.email,
          password: account.password,
          options: {
            data: {
              full_name: account.name,
              role: account.role,
            },
          }
        });
        
        if (signUpError && !signUpError.message.includes('User already registered')) {
          console.warn(`Failed to create demo account ${account.email}:`, signUpError.message);
        } else if (signUpData?.user) {
          console.log(`Created demo account: ${account.email}`);
        }
      }
      
      setIsInitialized(true);
    } catch (err) {
      console.error('Error initializing demo accounts:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize demo accounts'));
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    isInitializing,
    isInitialized,
    error,
    initializeDemoAccounts
  };
};
