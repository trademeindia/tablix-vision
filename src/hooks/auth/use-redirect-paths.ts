
/**
 * Helper function to determine the redirect path based on user role
 */
export const getRedirectPathByRole = (userRole: string | null | undefined): string => {
  // Handle null or undefined roles
  if (!userRole) {
    console.log('No role provided, defaulting to customer menu');
    return '/customer/menu';
  }
  
  // Normalize role to lowercase for case-insensitive comparison
  const role = userRole.toLowerCase();
  
  switch (role) {
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
      // Log for debugging purposes
      console.log(`Unknown role: ${userRole}, defaulting to customer menu`);
      return '/customer/menu';
  }
};

// Determine if user has permissions for a specific route
export const hasRoutePermission = (path: string, userRoles: string[]): boolean => {
  // Normalize roles to lowercase
  const normalizedRoles = userRoles.map(role => role.toLowerCase());
  
  // Check different route patterns and required roles
  if (path.startsWith('/dashboard') || path.startsWith('/menu') || 
      path.startsWith('/analytics') || path.startsWith('/settings')) {
    return normalizedRoles.some(role => ['owner', 'manager'].includes(role));
  }
  
  if (path.startsWith('/staff-dashboard/kitchen')) {
    return normalizedRoles.some(role => ['chef', 'owner', 'manager'].includes(role));
  }
  
  if (path.startsWith('/staff-dashboard/orders')) {
    return normalizedRoles.some(role => ['waiter', 'owner', 'manager'].includes(role));
  }
  
  if (path.startsWith('/staff-dashboard')) {
    return normalizedRoles.some(role => ['staff', 'chef', 'waiter', 'owner', 'manager'].includes(role));
  }
  
  // Customer routes are accessible to all users
  if (path.startsWith('/customer')) {
    return true;
  }
  
  return false;
};
