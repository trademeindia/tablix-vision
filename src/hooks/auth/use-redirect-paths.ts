/**
 * Helper function to determine the redirect path based on user role
 */
export const getRedirectPathByRole = (userRole: string | null | undefined): string => {
  // Handle null or undefined roles
  if (!userRole) {
    console.log('No role provided, defaulting to customer menu');
    return '/customer/menu';
  }
  
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
      // Keep customer role for QR code scanning access
      return '/customer/menu';
    default:
      // Fallback to customer menu as default
      console.log(`Unknown role: ${userRole}, defaulting to customer menu`);
      return '/customer/menu';
  }
};
