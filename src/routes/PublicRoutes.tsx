
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

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Landing and public routes */}
      <Route path="/" element={<Menu360LandingPage />} />
      <Route path="/index" element={<Index />} />
      <Route path="/menu360" element={<Menu360LandingPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/customer-menu" element={<CustomerMenuPage />} />
      
      {/* Auth routes - Explicitly handle both approaches: with and without /auth prefix */}
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="update-password" element={<UpdatePasswordPage />} />
      <Route path="callback" element={<AuthCallbackPage />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
