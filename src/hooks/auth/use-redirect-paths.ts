
/**
 * Helper function to determine the redirect path based on user role
 */
export const getRedirectPathByRole = (userRole: string): string => {
  // Ensure customer role always redirects to customer menu
  if (userRole === 'customer') {
    return '/customer/menu';
  }
  
  // Standard redirects for other roles
  return userRole === 'staff' ? '/staff-dashboard' :
         userRole === 'chef' ? '/staff-dashboard/kitchen' :
         userRole === 'waiter' ? '/staff-dashboard/orders' : '/dashboard';
};
