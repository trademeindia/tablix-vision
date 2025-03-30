
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // This will throw the same error if rendered outside a Router,
  // but ensures the component only renders when Router is available
  useLocation();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Hide sidebar on mobile */}
      <div className={`${isMobile ? 'hidden' : 'block'}`}>
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
