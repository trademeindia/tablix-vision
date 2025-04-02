
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Utensils, QrCode, Users, BarChart, 
  ShoppingCart, CloudUpload, Landmark, FileText, Settings
} from 'lucide-react';

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
      icon: <Landmark className="h-5 w-5" />,
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
    },
    {
      to: '/invoices',
      icon: <FileText className="h-5 w-5" />,
      label: 'Invoices'
    },
    {
      to: '/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings'
    }
  ];

  return (
    <div className="w-64 flex-shrink-0 h-full bg-[#1A2942] text-white shadow-lg">
      <div className="px-6 py-5 flex items-center border-b border-slate-700/50">
        <h1 className="text-xl font-bold">Ristorante</h1>
      </div>
      
      <div className="px-3 py-4 space-y-1">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            end={link.exact}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2.5 rounded-md text-sm font-medium w-full transition-colors",
              isActive 
                ? "bg-blue-600/20 text-blue-100" 
                : link.highlight
                  ? "text-blue-300 bg-blue-500/10 hover:bg-blue-500/20"
                  : "text-slate-300 hover:bg-slate-700/30 hover:text-white"
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
