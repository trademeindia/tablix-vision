
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Utensils, 
  QrCode, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  BarChart, 
  UserCircle, 
  Settings, 
  Menu as MenuIcon
} from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Menu Management",
    href: "/menu",
    icon: <Utensils className="h-5 w-5" />,
  },
  {
    title: "QR Codes",
    href: "/qr-codes",
    icon: <QrCode className="h-5 w-5" />,
  },
  {
    title: "Table Management",
    href: "/tables",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <UserCircle className="h-5 w-5" />,
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

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
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
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
