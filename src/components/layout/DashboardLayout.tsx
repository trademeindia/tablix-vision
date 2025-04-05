
import React, { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar - shown conditionally */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 z-40 transition-opacity duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/50" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative h-full w-64 bg-sidebar-background">
            <Sidebar onCloseSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Desktop sidebar - always visible */}
      <div className={`${isMobile ? 'hidden' : 'block'}`}>
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuButtonClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
