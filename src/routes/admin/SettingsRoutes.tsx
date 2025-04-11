
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SettingsPage from '@/pages/settings/SettingsPage';
import AppearancePage from '@/pages/settings/AppearancePage';
import NotificationsPage from '@/pages/settings/NotificationsPage';
import IntegrationsPage from '@/pages/settings/IntegrationsPage';
import IntegrationDetailPage from '@/pages/settings/integration/IntegrationDetailPage';

const SettingsRoutes = () => {
  return (
    <>
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings/appearance" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <AppearancePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings/notifications" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <NotificationsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings/integrations" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <IntegrationsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings/integrations/:id" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <IntegrationDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings/integrations/:id/setup" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <IntegrationDetailPage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default SettingsRoutes;
