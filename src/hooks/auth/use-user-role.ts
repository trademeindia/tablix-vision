
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UseUserRoleReturn } from './types/user-role.types';
import { demoAccountRoles } from './demo-accounts';
import { expandRoles, persistRoles, loadPersistedRoles } from './role-utils';

export const useUserRole = (): UseUserRoleReturn => {
  const [userRoles, setUserRoles] = useState<UserRole[]>(['customer']); // Default to customer for development
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load persisted roles on initialization
  useEffect(() => {
    const savedRoles = loadPersistedRoles();
    if (savedRoles) {
      setUserRoles(savedRoles);
      console.log('Restored roles from localStorage:', savedRoles);
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
          const roles = expandRoles(selectedRole as UserRole);
          
          // Save roles to localStorage for persistence
          persistRoles(roles);
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
          persistRoles(roles);
          
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
        
        // Check if role is stored in user_metadata
        if (userMetadata && userMetadata.role) {
          const role = userMetadata.role as UserRole;
          console.log("Found role in user metadata:", role);
          
          // Map single role to array of roles based on hierarchy
          const roles = expandRoles(role);
          
          // Save roles to localStorage for persistence
          persistRoles(roles);
          
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
      }

      // Try to get user profile data if role not found elsewhere
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
          
          persistRoles(roles);
          
          setUserRoles(roles);
          setLoading(false);
          return roles;
        }
      } catch (profileError) {
        console.log('Error fetching profile:', profileError);
      }
      
      // For development, determine roles based on email patterns
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
        
        persistRoles(defaultRoles);
        
        setUserRoles(defaultRoles);
        setLoading(false);
        return defaultRoles;
      }
      
      // Default role
      console.log("Using default customer role");
      const defaultRoles: UserRole[] = ['customer'];
      
      persistRoles(defaultRoles);
      
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
