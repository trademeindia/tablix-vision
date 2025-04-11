
import { UserRole } from './types/user-role.types';

// Add implied roles based on hierarchy
export function expandRoles(selectedRole: UserRole): UserRole[] {
  let roles: UserRole[] = [selectedRole];
  
  // Add implied roles
  if (selectedRole === 'owner') roles.push('manager');
  if (selectedRole === 'chef' || selectedRole === 'waiter') roles.push('staff');
  
  return roles;
}

// Save roles to localStorage for persistence
export function persistRoles(roles: UserRole[]): void {
  localStorage.setItem('userRole', JSON.stringify(roles));
}

// Load roles from localStorage
export function loadPersistedRoles(): UserRole[] | null {
  const savedRole = localStorage.getItem('userRole');
  if (!savedRole) return null;
  
  try {
    const parsedRoles = JSON.parse(savedRole) as UserRole[];
    if (Array.isArray(parsedRoles) && parsedRoles.length > 0) {
      return parsedRoles;
    }
    
    // If single string stored instead of array, convert it
    if (typeof savedRole === 'string') {
      try {
        return [savedRole as UserRole];
      } catch (conversionError) {
        console.error('Error converting role string:', conversionError);
      }
    }
  } catch (e) {
    console.error('Error parsing saved roles:', e);
  }
  
  return null;
}
