
/**
 * Helper function to determine the redirect path based on user role
 */
export const getRedirectPathByRole = (userRole: string): string => {
  return userRole === 'customer' ? '/customer/menu' :
         userRole === 'staff' ? '/staff-dashboard' :
         userRole === 'chef' ? '/staff-dashboard/kitchen' :
         userRole === 'waiter' ? '/staff-dashboard/orders' : '/dashboard';
};
