
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
  'manager@demo.com': ['manager'],
  'chef@demo.com': ['chef', 'staff'],
  'waiter@demo.com': ['waiter', 'staff'],
  'staff@demo.com': ['staff'],
  'customer@demo.com': ['customer'],
};

export const useUserRole = (): UseUserRoleReturn => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
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
        
        // Demo accounts should always get their role from localStorage first if it exists
        const savedRole = localStorage.getItem('lastUserRole') as UserRole | null;
        if (savedRole && email?.endsWith('@demo.com')) {
          console.log("Using saved role from localStorage for demo account:", savedRole);
          
          // Map single role to array of roles based on hierarchy
          let roles: UserRole[] = [savedRole as UserRole];
          
          // Add implied roles
          if (savedRole === 'owner') roles.push('manager');
          if (savedRole === 'chef' || savedRole === 'waiter') roles.push('staff');
          
          setUserRoles(roles);
          setLoading(false);
          
          // Ensure user metadata is updated with this role
          try {
            await supabase.auth.updateUser({
              data: { role: savedRole }
            });
          } catch (error) {
            console.error("Failed to update user metadata with role:", error);
          }
          
          return roles;
        }
        
        // Handle demo accounts explicitly to ensure they always get the right roles
        if (email && email.endsWith('@demo.com')) {
          // Get role directly from email pattern for demo accounts
          const roleKey = Object.keys(demoAccountRoles).find(key => 
            email === key || email.includes(key.split('@')[0])
          );
          
          let roles: UserRole[] = [];
          
          if (roleKey) {
            roles = demoAccountRoles[roleKey];
          } else {
            // Fallback for demo accounts with non-standard emails
            if (email.includes('owner')) roles = ['owner', 'manager'];
            else if (email.includes('chef')) roles = ['chef', 'staff'];
            else if (email.includes('waiter')) roles = ['waiter', 'staff'];
            else if (email.includes('staff')) roles = ['staff'];
            else roles = ['customer'];
          }
          
          console.log("Found demo account by email:", email, "with roles:", roles);
          
          // Update user metadata with this role if missing
          if (userMetadata?.role === undefined || userMetadata?.role === null) {
            try {
              await supabase.auth.updateUser({
                data: { role: roles[0] }
              });
              console.log(`Updated user metadata with role: ${roles[0]}`);
            } catch (updateError) {
              console.error("Failed to update user metadata with role:", updateError);
            }
          }
          
          // Save the last used role in localStorage for persistence
          localStorage.setItem('lastUserRole', roles[0]);
          
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
          
          // Remember this role for persistence
          localStorage.setItem('lastUserRole', role);
          
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
            localStorage.setItem('lastUserRole', 'owner');
            setLoading(false);
            return roles;
          } else if (email.includes('chef')) {
            console.log("Assigning chef role based on email pattern");
            const roles: UserRole[] = ['chef', 'staff'];
            localStorage.setItem('lastUserRole', 'chef');
            setUserRoles(roles);
            setLoading(false);
            return roles;
          } else if (email.includes('waiter')) {
            console.log("Assigning waiter role based on email pattern");
            const roles: UserRole[] = ['waiter', 'staff'];
            localStorage.setItem('lastUserRole', 'waiter');
            setUserRoles(roles);
            setLoading(false);
            return roles;
          } else if (email.includes('staff')) {
            console.log("Assigning staff role based on email pattern");
            const roles: UserRole[] = ['staff'];
            localStorage.setItem('lastUserRole', 'staff');
            setUserRoles(roles);
            setLoading(false);
            return roles;
          } else if (email.includes('customer')) {
            console.log("Assigning customer role based on email pattern");
            const roles: UserRole[] = ['customer'];
            localStorage.setItem('lastUserRole', 'customer');
            setUserRoles(roles);
            setLoading(false);
            return roles;
          }
        }
      }
      
      // Check localStorage as fallback for role persistence between page refreshes
      const savedRole = localStorage.getItem('lastUserRole') as UserRole | null;
      if (savedRole) {
        console.log("Using saved role from localStorage:", savedRole);
        let roles: UserRole[] = [savedRole];
        
        // Add implied roles
        if (savedRole === 'owner') roles.push('manager');
        if (savedRole === 'chef' || savedRole === 'waiter') roles.push('staff');
        
        setUserRoles(roles);
        setLoading(false);
        return roles;
      }
      
      // Last resort: try to get user profile data from database
      try {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        if (!userError && userData && userData.role) {
          // If the profile has a role field, use that
          const roles = Array.isArray(userData.role) ? userData.role as UserRole[] : [userData.role as UserRole];
          console.log("Found role in profile:", roles);
          localStorage.setItem('lastUserRole', roles[0]);
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
      } catch (profileError) {
        console.log('Error fetching profile:', profileError);
      }
      
      // Default owner role for easy demo access if nothing else worked
      if (authData?.user?.email?.endsWith('@demo.com')) {
        console.log("Setting default owner role for demo account");
        const defaultRoles: UserRole[] = ['owner', 'manager'];
        localStorage.setItem('lastUserRole', 'owner');
        setUserRoles(defaultRoles);
        setLoading(false);
        return defaultRoles;
      }
      
      // Default role if nothing else worked
      console.log("Using default customer role");
      const defaultRoles: UserRole[] = ['customer'];
      localStorage.setItem('lastUserRole', 'customer');
      setUserRoles(defaultRoles);
      setLoading(false);
      return defaultRoles;
      
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user roles'));
      
      // Try to get role from localStorage as a fallback
      const savedRole = localStorage.getItem('lastUserRole') as UserRole | null;
      if (savedRole) {
        console.log("Using saved role from localStorage after error:", savedRole);
        let roles: UserRole[] = [savedRole];
        
        // Add implied roles
        if (savedRole === 'owner') roles.push('manager');
        if (savedRole === 'chef' || savedRole === 'waiter') roles.push('staff');
        
        setUserRoles(roles);
        setLoading(false);
        return roles;
      }
      
      setLoading(false);
      return ['customer']; // Safe fallback
    }
  }, []);

  return {
    userRoles,
    fetchUserRoles,
    loading,
    error,
  };
};
