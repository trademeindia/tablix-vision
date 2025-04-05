
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the available user roles
export type UserRole = 'owner' | 'manager' | 'chef' | 'waiter' | 'staff' | 'customer';

interface UseUserRoleReturn {
  userRoles: UserRole[];
  fetchUserRoles: (userId: string) => Promise<void>;
  addUserRole: (userId: string, role: UserRole) => Promise<void>;
  removeUserRole: (userId: string, role: UserRole) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

export const useUserRole = (): UseUserRoleReturn => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  const fetchUserRoles = async (userId: string) => {
    try {
      // First try to get roles from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileData && profileData.role) {
        // If role is stored as a string
        if (typeof profileData.role === 'string') {
          setUserRoles([profileData.role as UserRole]);
        } 
        // If role is stored as an array
        else if (Array.isArray(profileData.role)) {
          setUserRoles(profileData.role as UserRole[]);
        }
        return;
      }

      // Fallback to checking staff table if no role in profiles
      if (profileError) {
        const { data: staffData } = await supabase
          .from('staff')
          .select('role')
          .eq('user_id', userId);
          
        if (staffData && staffData.length > 0) {
          const roles = staffData.map(staff => staff.role as UserRole);
          setUserRoles(roles);
          return;
        }
      }

      // Default to customer role if no other roles found
      setUserRoles(['customer']);
      
    } catch (error) {
      console.error('Error fetching user roles:', error);
      // Default to empty array if error
      setUserRoles([]);
    }
  };

  const addUserRole = async (userId: string, role: UserRole) => {
    try {
      // Update the profiles table with the new role
      // This is a simplified example - in production, you might want to use a separate user_roles table
      await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
        
      // Refresh roles
      await fetchUserRoles(userId);
    } catch (error) {
      console.error('Error adding user role:', error);
    }
  };

  const removeUserRole = async (userId: string, role: UserRole) => {
    try {
      // For this simplified example, we'll just clear the role if it matches
      // In a real app with multiple roles, you would use a user_roles table with proper remove logic
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (data && data.role === role) {
        await supabase
          .from('profiles')
          .update({ role: null })
          .eq('id', userId);
      }
      
      // Refresh roles
      await fetchUserRoles(userId);
    } catch (error) {
      console.error('Error removing user role:', error);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  return {
    userRoles,
    fetchUserRoles,
    addUserRole,
    removeUserRole,
    hasRole,
  };
};
