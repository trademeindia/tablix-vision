
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

// Demo account emails and their associated roles - make this more explicit
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
      console.log("Fetching user roles for userId:", userId);
      
      // First try to get the user data from auth.getUser() API
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (!authError && authData?.user) {
        const email = authData.user.email?.toLowerCase();
        const userMetadata = authData.user.user_metadata;
        
        console.log("User data from auth:", { email, metadata: userMetadata });
        
        // Handle demo accounts explicitly to ensure they always get the right roles
        if (email && Object.keys(demoAccountRoles).includes(email)) {
          const roles = demoAccountRoles[email];
          console.log("Found demo account by email:", email, "with roles:", roles);
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
        
        // Check if role is stored in user_metadata - primary source of truth
        if (userMetadata && userMetadata.role) {
          const role = userMetadata.role as UserRole;
          console.log("Found role in user metadata:", role);
          
          // Map single role to array of roles based on hierarchy
          let roles: UserRole[] = [role];
          
          // Add implied roles
          if (role === 'owner') roles.push('manager');
          if (role === 'chef' || role === 'waiter') roles.push('staff');
          
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }

        // If role not found in metadata, check if the email follows a pattern - backup method
        if (email) {
          if (email.includes('owner')) {
            console.log("Assigning owner role based on email pattern");
            const roles: UserRole[] = ['owner', 'manager'];
            setUserRoles(roles);
            setLoading(false);
            return roles;
          } else if (email.includes('chef')) {
            console.log("Assigning chef role based on email pattern");
            const roles: UserRole[] = ['chef', 'staff'];
            setUserRoles(roles);
            setLoading(false);
            return roles;
          } else if (email.includes('waiter')) {
            console.log("Assigning waiter role based on email pattern");
            const roles: UserRole[] = ['waiter', 'staff'];
            setUserRoles(roles);
            setLoading(false);
            return roles;
          } else if (email.includes('staff')) {
            console.log("Assigning staff role based on email pattern");
            const roles: UserRole[] = ['staff'];
            setUserRoles(roles);
            setLoading(false);
            return roles;
          } else if (email.includes('customer')) {
            console.log("Assigning customer role based on email pattern");
            const roles: UserRole[] = ['customer'];
            setUserRoles(roles);
            setLoading(false);
            return roles;
          }
        }
      }
      
      // Last resort: try to get user profile data from database
      try {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (!userError && userData && userData.role) {
          // If the profile has a role field, use that
          const roles = Array.isArray(userData.role) ? userData.role as UserRole[] : [userData.role as UserRole];
          console.log("Found role in profile:", roles);
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
      } catch (profileError) {
        console.log('Error fetching profile:', profileError);
      }
      
      // Default role if nothing else worked
      console.log("Using default customer role");
      const defaultRoles: UserRole[] = ['customer'];
      setUserRoles(defaultRoles);
      setLoading(false);
      return defaultRoles;
      
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user roles'));
      setLoading(false);
      return ['customer']; // Safe fallback
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
