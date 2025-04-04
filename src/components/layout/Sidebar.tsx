import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Utensils, QrCode, Users, BarChart, ShoppingCart, CloudUpload, FileText, Settings, CalendarDays, MessageSquare, PieChart, Palette, Bell, BookOpen, Megaphone, Database, Package } from 'lucide-react';

const Sidebar = () => {
  // Group links by section for better organization
  const sections = [{
    title: "Main",
    links: [{
      to: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
      exact: true
    }, {
      to: '/google-drive-test',
      icon: <CloudUpload className="h-5 w-5" />,
      label: 'Drive Setup',
      highlight: true
    }]
  }, {
    title: "Restaurant Management",
    links: [{
      to: '/menu',
      icon: <Utensils className="h-5 w-5" />,
      label: 'Menu'
    }, {
      to: '/qr-codes',
      icon: <QrCode className="h-5 w-5" />,
      label: 'QR Codes'
    }, {
      to: '/tables',
      icon: <CalendarDays className="h-5 w-5" />,
      label: 'Tables & Reservations'
    }, {
      to: '/inventory',
      icon: <Package className="h-5 w-5" />,
      label: 'Inventory'
    }]
  }, {
    title: "Staff & Customers",
    links: [{
      to: '/staff',
      icon: <Users className="h-5 w-5" />,
      label: 'Staff'
    }, {
      to: '/customers',
      icon: <BookOpen className="h-5 w-5" />,
      label: 'Customers'
    }]
  }, {
    title: "Orders & Invoices",
    links: [{
      to: '/orders',
      icon: <ShoppingCart className="h-5 w-5" />,
      label: 'Orders'
    }, {
      to: '/invoices',
      icon: <FileText className="h-5 w-5" />,
      label: 'Invoices'
    }]
  }, {
    title: "Analytics & Marketing",
    links: [{
      to: '/analytics',
      icon: <BarChart className="h-5 w-5" />,
      label: 'Analytics'
    }, {
      to: '/marketing',
      icon: <Megaphone className="h-5 w-5" />,
      label: 'Marketing'
    }]
  }, {
    title: "Settings",
    links: [{
      to: '/settings/integrations',
      icon: <Database className="h-5 w-5" />,
      label: 'Integrations'
    }, {
      to: '/settings/appearance',
      icon: <Palette className="h-5 w-5" />,
      label: 'Appearance'
    }, {
      to: '/settings/notifications',
      icon: <Bell className="h-5 w-5" />,
      label: 'Notifications'
    }, {
      to: '/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'General Settings'
    }]
  }];
  
  return <div className="w-64 flex-shrink-0 h-full bg-[#1A2942] text-white shadow-lg overflow-y-auto">
      <div className="px-6 py-5 flex items-center border-b border-slate-700/50">
        <h1 className="text-xl font-bold text-center">Resturant Management</h1>
      </div>
      
      <div className="px-3 py-4 space-y-4">
        {sections.map((section, sectionIndex) => <div key={sectionIndex} className="space-y-1">
            <h2 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {section.title}
            </h2>
            
            {section.links.map((link, linkIndex) => <NavLink key={linkIndex} to={link.to} end={link.exact} className={({
          isActive
        }) => cn("flex items-center px-3 py-2.5 rounded-md text-sm font-medium w-full transition-colors", isActive ? "bg-blue-600/20 text-blue-100" : link.highlight ? "text-blue-300 bg-blue-500/10 hover:bg-blue-500/20" : "text-slate-300 hover:bg-slate-700/30 hover:text-white")}>
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </NavLink>)}
          </div>)}
      </div>
    </div>;
};

export default Sidebar;
