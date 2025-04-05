
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

export const useUserRole = (): UseUserRoleReturn => {
  const [userRoles, setUserRoles] = useState<UserRole[]>(['customer']); // Default to customer for development
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserRoles = useCallback(async (userId: string): Promise<UserRole[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we're using mock roles. In a production app, this would fetch from your database
      // In a real application, you'd fetch roles from Supabase
      
      // Example real implementation:
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
      // This should be replaced with actual database queries in production
      
      // For testing purposes - giving all users all roles
      const mockRoles: UserRole[] = ['customer', 'owner', 'manager', 'chef', 'waiter', 'staff'];
      setUserRoles(mockRoles);
      
      return mockRoles;
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user roles'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    userRoles,
    fetchUserRoles,
    loading,
    error,
  };
};
