
import { useState, useEffect } from 'react';

// Define valid user roles
export type UserRole = 'owner' | 'manager' | 'chef' | 'waiter' | 'staff' | 'customer';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>('customer');
  
  // Load saved role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole && isValidRole(savedRole)) {
      setUserRole(savedRole as UserRole);
    }
  }, []);
  
  // Save role to localStorage
  const changeRole = (newRole: UserRole) => {
    setUserRole(newRole);
    localStorage.setItem('userRole', newRole);
  };
  
  // Helper to validate roles
  const isValidRole = (role: string): role is UserRole => {
    return ['owner', 'manager', 'chef', 'waiter', 'staff', 'customer'].includes(role);
  };
  
  return { userRole, changeRole };
};
