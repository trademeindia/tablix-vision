
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
      // Get the user's email to check if it's a demo account
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();
        
      // If we fail to get the user email (due to permissions or other issues),
      // we'll check if we can detect demo accounts through another method
      if (userError) {
        console.log('Could not fetch user data, checking for demo account through other means');
        
        // For demo accounts, we can try to get the email from the auth.getUser() API
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (!authError && authData && authData.user && authData.user.email) {
          const email = authData.user.email;
          
          // Check if this is a demo account
          if (demoAccountRoles[email]) {
            const roles = demoAccountRoles[email];
            setUserRoles(roles);
            setLoading(false);
            return roles;
          }
        }
        
        // For development, let's just return a mock role
        // This should be replaced with actual database queries in production
        const mockRoles: UserRole[] = ['customer', 'owner', 'manager', 'chef', 'waiter', 'staff'];
        setUserRoles(mockRoles);
        setLoading(false);
        return mockRoles;
      }
      
      // Check if this is a demo account
      if (userData && userData.email && demoAccountRoles[userData.email]) {
        const roles = demoAccountRoles[userData.email];
        setUserRoles(roles);
        setLoading(false);
        return roles;
      }
      
      // In a real application, you'd fetch roles from Supabase like this:
      /*
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      const roles = (data || []).map(item => item.role) as UserRole[];
      setUserRoles(roles.length > 0 ? roles : ['customer']);
      return roles;
      */
      
      // For development, let's just return a mock role
      const mockRoles: UserRole[] = ['customer', 'owner', 'manager', 'chef', 'waiter', 'staff'];
      setUserRoles(mockRoles);
      setLoading(false);
      
      return mockRoles;
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user roles'));
      setLoading(false);
      return [];
    }
  }, []);

  return {
    userRoles,
    fetchUserRoles,
    loading,
    error,
  };
};
