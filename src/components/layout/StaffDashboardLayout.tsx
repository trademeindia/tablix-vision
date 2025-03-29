
import React from 'react';
import StaffSidebar from './StaffSidebar';
import StaffHeader from './StaffHeader';
import { useLocation } from 'react-router-dom';

interface StaffDashboardLayoutProps {
  children: React.ReactNode;
}

const StaffDashboardLayout: React.FC<StaffDashboardLayoutProps> = ({ children }) => {
  // This will throw the same error if rendered outside a Router,
  // but ensures the component only renders when Router is available
  useLocation();
  
  return (
    <div className="flex h-screen bg-slate-50">
      <StaffSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StaffHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffDashboardLayout;
