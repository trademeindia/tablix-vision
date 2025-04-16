
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MenuIcon, 
  ShoppingCart, 
  Users, 
  Settings,
  QrCode,
  PanelLeftClose,
  ChefHat,
  CalendarClock,
  BarChart3,
  CircleDollarSign,
  Home,
  FileText,
  Megaphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onCloseSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCloseSidebar }) => {
  let location;
  try {
    location = useLocation();
  } catch (err) {
    console.error('Router error:', err);
    location = { pathname: '/' };
  }
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Menu', href: '/menu', icon: MenuIcon },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Tables', href: '/tables', icon: CalendarClock },
    { name: 'Inventory', href: '/inventory', icon: FileText },
    { name: 'Staff', href: '/staff', icon: ChefHat },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Marketing', href: '/marketing', icon: Megaphone },
    { name: 'QR Codes', href: '/qr-codes', icon: QrCode },
    { name: 'Invoices', href: '/invoices', icon: CircleDollarSign },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  console.log('Sidebar - Current path:', location.pathname);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl">
      <div className="flex items-center justify-between px-5 py-6 border-b border-slate-700/50">
        <Link to="/dashboard" className="flex items-center">
          <div className="bg-blue-500 p-2 rounded-lg mr-2">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Menu360</span>
        </Link>
        {onCloseSidebar && (
          <button 
            onClick={onCloseSidebar}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/70 transition-all lg:hidden"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4 px-3">
        <nav className="mt-2 flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                )}
                onClick={() => {
                  console.log(`Navigating to ${item.href}`);
                  if (onCloseSidebar) onCloseSidebar();
                }}
              >
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive 
                      ? "text-blue-200"
                      : "text-slate-400 group-hover:text-slate-200"
                  )}
                  aria-hidden="true"
                />
                <span className={isActive ? "font-semibold" : ""}>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
            M
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Restaurant Admin</p>
            <p className="text-xs text-slate-400">admin@restaurant.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
