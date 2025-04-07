
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  ChefHat,
  ClipboardList,
  BarChart,
  Menu as MenuIcon,
  X,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth, UserRole } from '@/contexts/AuthContext';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/staff-dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['waiter', 'chef', 'manager', 'staff'],
  },
  {
    title: "Orders",
    href: "/staff-dashboard/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    roles: ['waiter', 'manager', 'staff'],
  },
  {
    title: "Kitchen View",
    href: "/staff-dashboard/kitchen",
    icon: <ChefHat className="h-5 w-5" />,
    roles: ['chef', 'manager', 'staff'],
  },
  {
    title: "Inventory",
    href: "/staff-dashboard/inventory",
    icon: <ClipboardList className="h-5 w-5" />,
    roles: ['manager', 'chef', 'staff'],
  },
  {
    title: "Reports",
    href: "/staff-dashboard/reports",
    icon: <BarChart className="h-5 w-5" />,
    roles: ['manager', 'staff'],
  },
];

interface StaffSidebarProps {
  onCloseSidebar?: () => void;
}

const StaffSidebar = ({ onCloseSidebar }: StaffSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const { userRoles, user } = useAuth();
  
  // Get user information
  const staffName = user?.user_metadata?.full_name || "Staff User";
  const staffRole = userRoles.includes('chef' as UserRole) ? "Chef" : 
                   userRoles.includes('waiter' as UserRole) ? "Waiter" : 
                   userRoles.includes('manager' as UserRole) ? "Manager" : "Staff";
  
  // Handle location errors gracefully
  let pathname = '/';
  try {
    pathname = useLocation().pathname;
  } catch (error) {
    console.error("Router error:", error);
  }
  
  useEffect(() => {
    // Short delay to ensure proper mounting
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };

  // Filter nav items based on user roles - convert strings to UserRole type
  const filteredNavItems = navItems.filter(item => 
    item.roles.some(role => userRoles.includes(role))
  );

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const staffInitials = getInitials(staffName);

  if (!mounted) {
    return <div className="h-full bg-slate-800 w-64"></div>;
  }

  return (
    <div className={cn(
      "h-full bg-slate-800 text-white flex flex-col transition-all duration-300 ease-in-out border-r border-slate-700",
      collapsed && !isMobile ? "w-20" : "w-full md:w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!(collapsed && !isMobile) && (
          <h1 className="text-xl font-bold">StaffPortal</h1>
        )}
        
        <div className="flex items-center">
          {/* Close button - only shown on mobile */}
          {onCloseSidebar && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onCloseSidebar}
              className="text-white hover:bg-slate-700 ml-auto"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          
          {/* Collapse button - only shown on desktop */}
          {!isMobile && (
            <button 
              onClick={toggleSidebar} 
              className={cn(
                "p-2 rounded-md hover:bg-slate-700 hidden md:block",
                collapsed && "mx-auto"
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {filteredNavItems.map((item) => (
            <Link 
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-3 text-sm rounded-md transition-colors",
                pathname === item.href
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white",
                collapsed && !isMobile ? "justify-center" : "justify-start",
                "active:bg-slate-600" // Add active state for touch feedback
              )}
              onClick={onCloseSidebar}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!(collapsed && !isMobile) && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <Separator className="bg-slate-700" />
      <div className="p-4">
        <Link to="/profile" className={cn(
          "flex items-center",
          collapsed && !isMobile ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="text-white font-medium">{staffInitials}</span>
          </div>
          {!(collapsed && !isMobile) && (
            <div className="ml-3">
              <p className="text-sm font-medium">{staffName}</p>
              <p className="text-xs text-slate-400">{staffRole}</p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default StaffSidebar;
