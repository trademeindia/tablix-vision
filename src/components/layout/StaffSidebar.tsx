
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
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/hooks/auth/types/user-role.types';

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
  const { user, userRoles } = useAuth();
  
  // Handle location errors gracefully
  let pathname = '/';
  try {
    pathname = useLocation().pathname;
  } catch (error) {
    console.error("Router error:", error);
  }
  
  // Get the user's primary role
  const primaryRole = userRoles[0] || 'staff';
  
  // Format the role name for display (capitalize first letter)
  const formattedRole = primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1);
  
  // Get staff name from user if available
  const staffName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Staff Member';
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Filter nav items based on current role
  const filteredNavItems = navItems.filter(item => 
    item.roles.some(role => userRoles.includes(role))
  );

  if (!mounted) {
    return <div className="h-full bg-slate-800 w-64"></div>;
  }

  console.log('Staff sidebar - current path:', pathname);

  return (
    <div className={cn(
      "h-full bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out border-r border-slate-700",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!collapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">StaffPortal</h1>
        )}
        
        <div className="flex items-center">
          {/* Close button - only shown on mobile */}
          {onCloseSidebar && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onCloseSidebar}
              className="text-white hover:bg-slate-700 lg:hidden mr-2"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          
          {/* Collapse button - only shown on desktop */}
          <button 
            onClick={toggleSidebar} 
            className={cn(
              "p-2 rounded-md hover:bg-slate-700 hidden lg:block",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link 
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-3 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white",
                  collapsed ? "justify-center" : "justify-start"
                )}
                onClick={() => {
                  console.log(`Navigating to ${item.href}`);
                  if (onCloseSidebar) onCloseSidebar();
                }}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.title}</span>}
                {isActive && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-700">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{staffName}</p>
              <p className="text-xs text-slate-400">{formattedRole}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;
