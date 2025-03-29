
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Utensils, 
  QrCode, 
  Users, 
  ShoppingCart, 
  BarChart, 
  ChefHat,
  Settings, 
  Menu as MenuIcon
} from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Menu Management",
    href: "/menu",
    icon: <Utensils className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "QR Codes",
    href: "/qr-codes",
    icon: <QrCode className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Table Management",
    href: "/tables",
    icon: <Users className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Orders",
    href: "/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Staff Management",
    href: "/staff",
    icon: <ChefHat className="h-5 w-5" />,
    section: "management"
  },
  {
    title: "Staff Dashboard",
    href: "/staff-dashboard",
    icon: <Users className="h-5 w-5" />,
    section: "management"
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart className="h-5 w-5" />,
    section: "management"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    section: "management"
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Group nav items by section
  const mainNavItems = navItems.filter(item => item.section === 'main');
  const managementNavItems = navItems.filter(item => item.section === 'management');

  return (
    <div className={cn(
      "h-screen bg-slate-800 text-white flex flex-col transition-all duration-300 ease-in-out border-r border-slate-700",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!collapsed && (
          <h1 className="text-xl font-bold">RestaurantDash</h1>
        )}
        <button 
          onClick={toggleSidebar} 
          className={cn(
            "p-2 rounded-md hover:bg-slate-700",
            collapsed && "mx-auto"
          )}
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-8">
          {/* Main navigation items */}
          <div>
            {!collapsed && <p className="px-3 text-xs uppercase text-slate-400 font-semibold mb-2">Main</p>}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <Link 
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm rounded-md transition-colors",
                    location.pathname === item.href
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Management navigation items */}
          <div>
            {!collapsed && <p className="px-3 text-xs uppercase text-slate-400 font-semibold mb-2">Management</p>}
            <div className="space-y-1">
              {managementNavItems.map((item) => (
                <Link 
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm rounded-md transition-colors",
                    location.pathname === item.href
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-700">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="text-white font-medium">JD</span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-slate-400">Restaurant Owner</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
