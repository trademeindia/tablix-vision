
import { useState, useEffect } from 'react';

// Define valid user roles
export type UserRole = 'owner' | 'manager' | 'chef' | 'waiter' | 'staff' | 'customer';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>('owner'); // Default to owner for development
  
  // Load saved role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole && isValidRole(savedRole)) {
      console.log('Loaded user role from storage:', savedRole);
      setUserRole(savedRole as UserRole);
    } else {
      // Set default role for development
      console.log('No saved role found, defaulting to owner');
      localStorage.setItem('userRole', 'owner');
    }
  }, []);
  
  // Save role to localStorage
  const changeRole = (newRole: UserRole) => {
    console.log('Changing user role to:', newRole);
    setUserRole(newRole);
    localStorage.setItem('userRole', newRole);
  };
  
  // Helper to validate roles
  const isValidRole = (role: string): role is UserRole => {
    return ['owner', 'manager', 'chef', 'waiter', 'staff', 'customer'].includes(role);
  };
  
  return { userRole, changeRole };
};
