
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import CustomerRoutes from './CustomerRoutes';
import StaffRoutes from './StaffRoutes';
import ProfileRoutes from './ProfileRoutes';
import PublicRoutes from './PublicRoutes';
import DebugPanel from '@/components/debug/DebugPanel';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  
  console.log('Current path:', path);

  return (
    <>
      <Routes>
        {/* Route groups */}
        <Route path="/customer/*" element={<CustomerRoutes />} />
        <Route path="/staff-dashboard/*" element={<StaffRoutes />} />
        <Route path="/profile/*" element={<ProfileRoutes />} />
        <Route path="/dashboard/*" element={<AdminRoutes />} />
        <Route path="/menu/*" element={<AdminRoutes />} />
        <Route path="/orders/*" element={<AdminRoutes />} />
        <Route path="/qr-codes/*" element={<AdminRoutes />} />
        <Route path="/analytics/*" element={<AdminRoutes />} />
        <Route path="/tables/*" element={<AdminRoutes />} />
        <Route path="/staff/*" element={<AdminRoutes />} />
        <Route path="/customers/*" element={<AdminRoutes />} />
        <Route path="/invoices/*" element={<AdminRoutes />} />
        <Route path="/inventory/*" element={<AdminRoutes />} />
        <Route path="/google-drive-test/*" element={<AdminRoutes />} />
        <Route path="/marketing/*" element={<AdminRoutes />} />
        <Route path="/settings/*" element={<AdminRoutes />} />
        
        {/* Public routes */}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
      <DebugPanel />
    </>
  );
};

export default AppRoutes;
