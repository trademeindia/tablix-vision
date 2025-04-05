
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the possible user roles as a union type
export type UserRole = 'owner' | 'manager' | 'chef' | 'waiter' | 'staff' | 'customer';

interface UseUserRoleReturn {
  userRoles: UserRole[];
  fetchUserRoles: (userId: string) => Promise<UserRole[]>;
  loading: boolean;
  error: Error | null;
}

// Demo account emails and their associated roles
const demoAccountRoles: Record<string, UserRole[]> = {
  'owner@demo.com': ['owner', 'manager'],
  'staff@demo.com': ['staff', 'waiter'],
  'chef@demo.com': ['chef', 'staff'],
  'waiter@demo.com': ['waiter', 'staff'],
  'customer@demo.com': ['customer'],
};

export const useUserRole = (): UseUserRoleReturn => {
  const [userRoles, setUserRoles] = useState<UserRole[]>(['customer']); // Default to customer for development
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserRoles = useCallback(async (userId: string): Promise<UserRole[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // For demo accounts, we can try to get the email from the auth.getUser() API
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (!authError && authData && authData.user && authData.user.email) {
        const email = authData.user.email;
        
        // Check if this is a demo account
        if (email in demoAccountRoles) {
          const roles = demoAccountRoles[email];
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
      }

      // If not a demo account, try to get user profile data
      try {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (!userError && userData && userData.role) {
          // If the profile has a role field, use that
          const roles = [userData.role as UserRole];
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
      } catch (profileError) {
        console.log('Error fetching profile:', profileError);
        // Continue to use demo or mock roles if profile fetch fails
      }
      
      // For development, let's just return a mock role based on the demo email patterns
      if (authData?.user?.email) {
        const email = authData.user.email.toLowerCase();
        if (email.includes('owner')) {
          setUserRoles(['owner', 'manager']);
          setLoading(false);
          return ['owner', 'manager'];
        } else if (email.includes('chef')) {
          setUserRoles(['chef', 'staff']);
          setLoading(false);
          return ['chef', 'staff'];
        } else if (email.includes('waiter')) {
          setUserRoles(['waiter', 'staff']);
          setLoading(false);
          return ['waiter', 'staff'];
        } else if (email.includes('staff')) {
          setUserRoles(['staff']);
          setLoading(false);
          return ['staff'];
        }
      }
      
      // Default role
      const defaultRoles: UserRole[] = ['customer'];
      setUserRoles(defaultRoles);
      setLoading(false);
      return defaultRoles;
      
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user roles'));
      setLoading(false);
      return ['customer'];
    }
  }, []);

  return {
    userRoles,
    fetchUserRoles,
    loading,
    error,
  };
};
