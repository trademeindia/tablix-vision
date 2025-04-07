
import React, { useState, useEffect } from 'react';
import StaffSidebar from './StaffSidebar';
import StaffHeader from './StaffHeader';
import DemoBanner from './DemoBanner';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetOverlay } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toaster';

interface StaffDashboardLayoutProps {
  children: React.ReactNode;
}

const StaffDashboardLayout: React.FC<StaffDashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { user, userRoles } = useAuth();
  
  // Check if the user is using a demo account
  const isDemoAccount = user?.email?.endsWith('@demo.com') || false;
  const demoRole = userRoles.includes('chef') ? 'chef' : 
                  userRoles.includes('waiter') ? 'waiter' : 
                  userRoles.includes('staff') ? 'staff' : '';
  
  // Use try-catch to handle any potential errors in useLocation
  let location;
  try {
    location = useLocation();
  } catch (error) {
    console.error("Error using router:", error);
  }
  
  useEffect(() => {
    // Ensure the component is mounted before showing content
    setIsLoaded(true);
    
    // Close sidebar when route changes on mobile
    if (isMobile && location) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Show a loading state initially to prevent flash of content
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Demo Banner - shown only for demo accounts */}
      {isDemoAccount && demoRole && <DemoBanner role={demoRole} />}
      
      {/* Header is always visible */}
      <StaffHeader onMenuButtonClick={toggleSidebar} />
      
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Mobile sidebar using Sheet component for better mobile experience */}
        {isMobile ? (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent 
              side="left" 
              className="p-0 w-[85%] max-w-[300px] border-r border-slate-200 bg-slate-800"
            >
              <StaffSidebar onCloseSidebar={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
        ) : (
          /* Desktop sidebar - always visible on larger screens */
          <div className="h-full hidden md:block">
            <StaffSidebar />
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto p-3 md:p-6 w-full">
          {children}
          <Toaster />
        </main>
      </div>
    </div>
  );
};

export default StaffDashboardLayout;
