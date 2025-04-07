
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
      console.log("Fetching user roles for userId:", userId);
      
      // First try to get the user data from auth.getUser() API
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (!authError && authData?.user) {
        const email = authData.user.email?.toLowerCase();
        const userMetadata = authData.user.user_metadata;
        
        console.log("User data from auth:", { email, metadata: userMetadata });
        
        // Check if this is a demo account by email
        if (email && Object.keys(demoAccountRoles).includes(email)) {
          const roles = demoAccountRoles[email as keyof typeof demoAccountRoles];
          console.log("Found demo account by email:", email, "with roles:", roles);
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
        
        // Check if role is stored in user_metadata
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

        // If role not found in metadata, check if the email matches a demo pattern
        if (email) {
          for (const [demoEmail, roles] of Object.entries(demoAccountRoles)) {
            if (email === demoEmail) {
              console.log("Matched email to demo account:", demoEmail, "with roles:", roles);
              setUserRoles(roles);
              setLoading(false);
              return roles;
            }
          }
        }
      }

      // If not determined from metadata, try to get user profile data
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
        // Continue to use demo or mock roles if profile fetch fails
      }
      
      // For development, check if the email follows a pattern for role assignment
      if (authData?.user?.email) {
        const email = authData.user.email.toLowerCase();
        if (email.includes('owner')) {
          console.log("Defaulting to owner role based on email pattern");
          setUserRoles(['owner', 'manager']);
          setLoading(false);
          return ['owner', 'manager'];
        } else if (email.includes('chef')) {
          console.log("Defaulting to chef role based on email pattern");
          setUserRoles(['chef', 'staff']);
          setLoading(false);
          return ['chef', 'staff'];
        } else if (email.includes('waiter')) {
          console.log("Defaulting to waiter role based on email pattern");
          setUserRoles(['waiter', 'staff']);
          setLoading(false);
          return ['waiter', 'staff'];
        } else if (email.includes('staff')) {
          console.log("Defaulting to staff role based on email pattern");
          setUserRoles(['staff']);
          setLoading(false);
          return ['staff'];
        } else if (email.includes('customer')) {
          console.log("Defaulting to customer role based on email pattern");
          setUserRoles(['customer']);
          setLoading(false);
          return ['customer'];
        }
      }
      
      // Default role
      console.log("Using default customer role");
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
