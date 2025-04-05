
import React, { useState, useEffect } from 'react';
import StaffSidebar from './StaffSidebar';
import StaffHeader from './StaffHeader';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface StaffDashboardLayoutProps {
  children: React.ReactNode;
}

const StaffDashboardLayout: React.FC<StaffDashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  // Use try-catch to handle any potential errors in useLocation
  let location;
  try {
    location = useLocation();
  } catch (error) {
    console.error("Error using router:", error);
    // Render a fallback UI
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  useEffect(() => {
    // Ensure the component is mounted before showing content
    setIsLoaded(true);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-slate-50 lg:flex-row">
      {/* Mobile sidebar - shown conditionally */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 z-40 transition-opacity duration-300 lg:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/50" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative h-full w-64 bg-slate-800 shadow-xl">
            <StaffSidebar onCloseSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Desktop sidebar - always visible on larger screens */}
      <div className={`${isMobile ? 'hidden' : 'hidden lg:block'}`}>
        <StaffSidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <StaffHeader onMenuButtonClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffDashboardLayout;
