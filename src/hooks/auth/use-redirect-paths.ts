
/**
 * Helper function to determine the redirect path based on user role
 */
export const getRedirectPathByRole = (userRole: string): string => {
  switch(userRole) {
    case 'customer':
      return '/customer/menu';
    case 'chef':
      return '/staff-dashboard/kitchen';
    case 'waiter':
      return '/staff-dashboard/orders';
    case 'owner':
      return '/dashboard';
    case 'manager':
      return '/dashboard';
    case 'staff':
      return '/staff-dashboard';
    default:
      return '/dashboard';
  }
};
