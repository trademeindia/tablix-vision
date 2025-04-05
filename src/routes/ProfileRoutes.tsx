
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfilePage from '@/pages/ProfilePage';

const ProfileRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Profile route - accessible to all authenticated users */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager', 'chef', 'waiter', 'staff', 'customer']}>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default ProfileRoutes;
