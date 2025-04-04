
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the role type based on our database enum
export type UserRole = 'owner' | 'manager' | 'chef' | 'waiter' | 'staff' | 'customer';

interface UseUserRoleReturn {
  userRoles: UserRole[];
  fetchUserRoles: (userId: string) => Promise<void>;
}

export const useUserRole = (): UseUserRoleReturn => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  // Fetch user roles
  const fetchUserRoles = async (userId: string) => {
    try {
      // Fetch profile to get the role
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message);
        setUserRoles([]);
        return;
      }

      // If role exists and is not null, use it
      if (data && data.role) {
        setUserRoles([data.role as UserRole]);
      } else {
        // Default to empty array if no roles found
        setUserRoles([]);
      }
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
      setUserRoles([]);
    }
  };

  return {
    userRoles,
    fetchUserRoles,
  };
};
