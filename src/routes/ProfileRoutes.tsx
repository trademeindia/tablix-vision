
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfilePage from '@/pages/ProfilePage';

const ProfileRoutes: React.FC = () => {
  console.log('Rendering ProfileRoutes');
  
  return (
    <Routes>
      {/* Profile route - accessible to all authenticated users */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default ProfileRoutes;
