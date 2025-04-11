
/**
 * Helper function to determine the redirect path based on user role
 */
export const getRedirectPathByRole = (userRole: string): string => {
  switch (userRole.toLowerCase()) {
    case 'owner':
      return '/dashboard';
    case 'manager':
      return '/dashboard';
    case 'chef':
      return '/staff-dashboard/kitchen';
    case 'waiter':
      return '/staff-dashboard/orders';
    case 'staff':
      return '/staff-dashboard';
    case 'customer':
      return '/customer/menu';
    default:
      // Fallback to customer menu as default
      console.log(`Unknown role: ${userRole}, defaulting to customer menu`);
      return '/customer/menu';
  }
};
