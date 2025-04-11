
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import QRCodePage from '@/pages/QRCodePage';

const QRCodeRoutes = () => {
  return (
    <>
      <Route 
        path="/qr-codes" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <QRCodePage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default QRCodeRoutes;
