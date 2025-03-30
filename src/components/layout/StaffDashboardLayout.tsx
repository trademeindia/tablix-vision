
import React, { useState } from 'react';
import StaffSidebar from './StaffSidebar';
import StaffHeader from './StaffHeader';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface StaffDashboardLayoutProps {
  children: React.ReactNode;
}

const StaffDashboardLayout: React.FC<StaffDashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // This will throw the same error if rendered outside a Router,
  // but ensures the component only renders when Router is available
  useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex flex-col h-screen bg-slate-50 lg:flex-row">
      {/* Mobile sidebar - shown conditionally */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
        sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div 
          className="absolute inset-0 bg-slate-900/50" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        <div className="relative h-full w-64 bg-slate-800 shadow-xl">
          <StaffSidebar onCloseSidebar={() => setSidebarOpen(false)} />
        </div>
      </div>
      
      {/* Desktop sidebar - always visible on larger screens */}
      <div className="hidden lg:block">
        <StaffSidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <StaffHeader onMenuButtonClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffDashboardLayout;
