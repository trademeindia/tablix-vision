
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
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type StaffRole = 'Waiter' | 'Chef' | 'Manager';

// In a real app, you would get the staff role from authentication
const currentRole: StaffRole = 'Manager'; // Changed to Manager to show all menu items

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: StaffRole[];
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/staff-dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['Waiter', 'Chef', 'Manager'],
  },
  {
    title: "Orders",
    href: "/staff-dashboard/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    roles: ['Waiter', 'Manager'],
  },
  {
    title: "Kitchen View",
    href: "/staff-dashboard/kitchen",
    icon: <ChefHat className="h-5 w-5" />,
    roles: ['Chef', 'Manager'],
  },
  {
    title: "Inventory",
    href: "/staff-dashboard/inventory",
    icon: <ClipboardList className="h-5 w-5" />,
    roles: ['Manager'],
  },
  {
    title: "Reports",
    href: "/staff-dashboard/reports",
    icon: <BarChart className="h-5 w-5" />,
    roles: ['Manager'],
  },
];

interface StaffSidebarProps {
  onCloseSidebar?: () => void;
}

const StaffSidebar = ({ onCloseSidebar }: StaffSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Handle location errors gracefully
  let pathname = '/';
  try {
    pathname = useLocation().pathname;
  } catch (error) {
    console.error("Router error:", error);
  }
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Filter nav items based on current role
  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));

  if (!mounted) {
    return <div className="h-full bg-slate-800 w-64"></div>;
  }

  return (
    <div className={cn(
      "h-full bg-slate-800 text-white flex flex-col transition-all duration-300 ease-in-out border-r border-slate-700",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!collapsed && (
          <h1 className="text-xl font-bold">StaffPortal</h1>
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
          {filteredNavItems.map((item) => (
            <Link 
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-3 text-sm rounded-md transition-colors",
                pathname === item.href
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white",
                collapsed ? "justify-center" : "justify-start"
              )}
              onClick={onCloseSidebar}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-700">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="text-white font-medium">JS</span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">Jane Smith</p>
              <p className="text-xs text-slate-400">{currentRole}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;
