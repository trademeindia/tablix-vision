
import { UserRole } from './types/user-role.types';

// Demo account emails and their associated roles
export const demoAccountRoles: Record<string, UserRole[]> = {
  'owner@demo.com': ['owner', 'manager'],
  'manager@demo.com': ['manager'],
  'staff@demo.com': ['staff', 'waiter'],
  'chef@demo.com': ['chef', 'staff'],
  'waiter@demo.com': ['waiter', 'staff'],
  'customer@demo.com': ['customer'],
};
