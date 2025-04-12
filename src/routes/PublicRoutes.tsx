
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Menu360LandingPage from '@/pages/landing/Menu360LandingPage';
import Index from '@/pages/Index';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import UpdatePasswordPage from '@/pages/auth/UpdatePasswordPage';
import AuthCallbackPage from '@/pages/auth/AuthCallbackPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import NotFound from '@/pages/NotFound';
import CustomerMenuPage from '@/pages/customer/MenuPage';
import { useAuth } from '@/contexts/AuthContext';
import { getRedirectPathByRole } from '@/hooks/auth/use-redirect-paths';

const PublicRoutes: React.FC = () => {
  const { user, userRoles, loading } = useAuth();
  
  // Get the appropriate redirect path based on user role
  const getRedirect = () => {
    if (!user || loading) return null;
    
    // If user is logged in and has roles, redirect to their dashboard
    if (userRoles && userRoles.length > 0) {
      return getRedirectPathByRole(userRoles[0]);
    }
    
    return null; // No redirect needed
  };

  // Component to handle conditional redirects for authenticated users
  const ConditionalAuthRoute = ({ children }: { children: React.ReactNode }) => {
    const redirectPath = getRedirect();
    return redirectPath ? <Navigate to={redirectPath} replace /> : <>{children}</>;
  };
  
  return (
    <Routes>
      {/* Landing and public routes */}
      <Route path="/" element={<Menu360LandingPage />} />
      <Route path="/index" element={<Index />} />
      <Route path="/menu360" element={<Menu360LandingPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/customer-menu" element={<CustomerMenuPage />} />
      
      {/* Auth routes */}
      <Route path="/login" element={
        <ConditionalAuthRoute>
          <LoginPage />
        </ConditionalAuthRoute>
      } />
      <Route path="/signup" element={
        <ConditionalAuthRoute>
          <SignupPage />
        </ConditionalAuthRoute>
      } />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/callback" element={<AuthCallbackPage />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
