
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Utensils, QrCode, Users, BarChart, 
         ShoppingCart, CloudUpload } from 'lucide-react';

const Sidebar = () => {
  const links = [
    {
      to: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
      exact: true
    },
    {
      to: '/google-drive-test',
      icon: <CloudUpload className="h-5 w-5" />,
      label: 'Drive Setup',
      highlight: true
    },
    {
      to: '/menu',
      icon: <Utensils className="h-5 w-5" />,
      label: 'Menu'
    },
    {
      to: '/qr-codes',
      icon: <QrCode className="h-5 w-5" />,
      label: 'QR Codes'
    },
    {
      to: '/tables',
      icon: <Users className="h-5 w-5" />,
      label: 'Tables'
    },
    {
      to: '/staff',
      icon: <Users className="h-5 w-5" />,
      label: 'Staff'
    },
    {
      to: '/orders',
      icon: <ShoppingCart className="h-5 w-5" />,
      label: 'Orders'
    },
    {
      to: '/analytics',
      icon: <BarChart className="h-5 w-5" />,
      label: 'Analytics'
    }
  ];

  return (
    <div className="w-64 flex-shrink-0 h-full bg-white border-r shadow-sm">
      <div className="px-6 py-5 flex items-center">
        <h1 className="text-xl font-bold">Restaurant Manager</h1>
      </div>
      
      <div className="px-3 py-2 space-y-1">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            end={link.exact}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium w-full",
              isActive 
                ? "bg-slate-100 text-slate-900" 
                : link.highlight
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <span className="mr-3">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
