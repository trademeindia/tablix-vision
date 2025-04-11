
import { useState, useCallback, useEffect } from 'react';
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
  'manager@demo.com': ['manager'],
  'staff@demo.com': ['staff', 'waiter'],
  'chef@demo.com': ['chef', 'staff'],
  'waiter@demo.com': ['waiter', 'staff'],
  'customer@demo.com': ['customer'],
};

export const useUserRole = (): UseUserRoleReturn => {
  const [userRoles, setUserRoles] = useState<UserRole[]>(['customer']); // Default to customer for development
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check the localStorage for saved role data
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      try {
        const parsedRoles = JSON.parse(savedRole) as UserRole[];
        if (Array.isArray(parsedRoles) && parsedRoles.length > 0) {
          setUserRoles(parsedRoles);
          console.log('Restored roles from localStorage:', parsedRoles);
        }
      } catch (e) {
        console.error('Error parsing saved roles:', e);
        // If single string stored instead of array, convert it
        if (typeof savedRole === 'string') {
          try {
            const roleArray = [savedRole as UserRole];
            setUserRoles(roleArray);
            console.log('Restored role from localStorage (string):', roleArray);
          } catch (conversionError) {
            console.error('Error converting role string:', conversionError);
            // In case of any issues, default to customer role
            setUserRoles(['customer']);
          }
        }
      }
    }
  }, []);

  const fetchUserRoles = useCallback(async (userId: string): Promise<UserRole[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // First try to get the user data from auth.getUser() API
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (!authError && authData?.user) {
        const email = authData.user.email?.toLowerCase();
        const userMetadata = authData.user.user_metadata;
        
        console.log("User data from auth:", { email, metadata: userMetadata });
        
        // Check if a selected role was stored during login
        const selectedRole = localStorage.getItem('selectedRole');
        if (selectedRole) {
          console.log("Found selected role in localStorage:", selectedRole);
          
          // Map single role to array of roles based on hierarchy
          let roles: UserRole[] = [selectedRole as UserRole];
          
          // Add implied roles
          if (selectedRole === 'owner') roles.push('manager');
          if (selectedRole === 'chef' || selectedRole === 'waiter') roles.push('staff');
          
          // Save roles to localStorage for persistence
          localStorage.setItem('userRole', JSON.stringify(roles));
          localStorage.removeItem('selectedRole'); // Clean up
          
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
        
        // Check if this is a demo account by email
        if (email && Object.prototype.hasOwnProperty.call(demoAccountRoles, email)) {
          const roles = demoAccountRoles[email as keyof typeof demoAccountRoles];
          console.log("Found demo account by email:", roles);
          
          // Save roles to localStorage for persistence
          localStorage.setItem('userRole', JSON.stringify(roles));
          
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
          
          // Save roles to localStorage for persistence
          localStorage.setItem('userRole', JSON.stringify(roles));
          
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
      }

      // If not determined from metadata, try to get user profile data
      try {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        if (!userError && userData && userData.role) {
          // If the profile has a role field, use that
          const roles = [userData.role as UserRole];
          console.log("Found role in profile:", roles);
          
          // Save roles to localStorage for persistence
          localStorage.setItem('userRole', JSON.stringify(roles));
          
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
        
        let defaultRoles: UserRole[] = ['customer'];
        
        if (email.includes('owner')) {
          console.log("Defaulting to owner role based on email pattern");
          defaultRoles = ['owner', 'manager'];
        } else if (email.includes('chef')) {
          console.log("Defaulting to chef role based on email pattern");
          defaultRoles = ['chef', 'staff'];
        } else if (email.includes('waiter')) {
          console.log("Defaulting to waiter role based on email pattern");
          defaultRoles = ['waiter', 'staff'];
        } else if (email.includes('staff')) {
          console.log("Defaulting to staff role based on email pattern");
          defaultRoles = ['staff'];
        }
        
        // Save roles to localStorage for persistence
        localStorage.setItem('userRole', JSON.stringify(defaultRoles));
        
        setUserRoles(defaultRoles);
        setLoading(false);
        return defaultRoles;
      }
      
      // Default role
      console.log("Using default customer role");
      const defaultRoles: UserRole[] = ['customer'];
      
      // Save roles to localStorage for persistence
      localStorage.setItem('userRole', JSON.stringify(defaultRoles));
      
      setUserRoles(defaultRoles);
      setLoading(false);
      return defaultRoles;
      
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user roles'));
      setLoading(false);
      
      // On error, still return a default role to prevent application errors
      const defaultRoles: UserRole[] = ['customer'];
      setUserRoles(defaultRoles);
      return defaultRoles;
    }
  }, []);
  
  // Log the current roles for debugging
  useEffect(() => {
    console.info("Current user roles:", userRoles);
  }, [userRoles]);

  return {
    userRoles,
    fetchUserRoles,
    loading,
    error,
  };
};
