
import { UserRole } from './use-user-role';

export const getRedirectPathByRole = (role: string): string => {
  switch (role) {
    case 'owner':
    case 'manager':
      return '/dashboard';
    case 'chef':
      return '/staff-dashboard/kitchen';
    case 'waiter':
    case 'staff':
      return '/staff-dashboard/orders';
    case 'customer':
      return '/customer/menu';
    default:
      // Default to main dashboard if role is unknown
      console.warn(`Unknown role: ${role}, redirecting to default dashboard`);
      return '/dashboard';
  }
};
