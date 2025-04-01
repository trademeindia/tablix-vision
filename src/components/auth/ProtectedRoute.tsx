
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Removed authentication logic to allow direct access
  console.log('Authentication bypass: Allowing access to protected route');
  return <>{children}</>;
};
