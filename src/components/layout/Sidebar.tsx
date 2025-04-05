
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MenuIcon, 
  FileText, 
  ShoppingCart, 
  Users, 
  Settings,
  QrCode,
  PanelLeftClose,
  ChefHat,
  CalendarClock,
  BarChart3,
  CircleDollarSign
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
    { name: 'QR Codes', href: '/qr-codes', icon: QrCode },
    { name: 'Invoices', href: '/invoices', icon: CircleDollarSign },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-sidebar-background">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-white">Menu360</span>
        </Link>
        {onCloseSidebar && (
          <button 
            onClick={onCloseSidebar}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 lg:hidden"
          >
            <PanelLeftClose className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </button>
        )}
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-1 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
                onClick={onCloseSidebar}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white',
                    'mr-3 flex-shrink-0 h-5 w-5'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
