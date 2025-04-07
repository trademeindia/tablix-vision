
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ChefHat, Utensils, User, BarChart, ShoppingBag, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserRole } from '@/hooks/use-user-role';

interface StaffSidebarProps {
  onCloseSidebar?: () => void;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({ onCloseSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, userRoles } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };
  
  const isLinkActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const isChef = userRoles.includes('chef' as UserRole);
  const isWaiter = userRoles.includes('waiter' as UserRole);
  const isManager = userRoles.includes('manager' as UserRole);
  
  const linkCls = (path: string) => {
    const baseCls = "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors";
    return isLinkActive(path)
      ? `${baseCls} bg-primary/10 text-white font-medium`
      : `${baseCls} hover:bg-slate-700 text-slate-300`;
  };
  
  return (
    <div className="flex flex-col h-full bg-slate-800 text-slate-200">
      <div className="p-4 space-y-1">
        <h2 className="text-lg font-semibold text-white">Staff Dashboard</h2>
        <p className="text-xs text-slate-400">Manage orders and operations</p>
      </div>
      
      <Separator className="bg-slate-700" />
      
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1.5">
          <Link 
            to="/staff-dashboard" 
            className={linkCls('/staff-dashboard')}
            onClick={onCloseSidebar}
          >
            <User className="h-4 w-4" /> Dashboard
          </Link>
          
          <Link 
            to="/staff-dashboard/orders" 
            className={linkCls('/staff-dashboard/orders')}
            onClick={onCloseSidebar}
          >
            <ShoppingBag className="h-4 w-4" /> Orders
          </Link>
          
          {isChef && (
            <Link 
              to="/staff-dashboard/kitchen" 
              className={linkCls('/staff-dashboard/kitchen')}
              onClick={onCloseSidebar}
            >
              <ChefHat className="h-4 w-4" /> Kitchen View
            </Link>
          )}
          
          <Link 
            to="/staff-dashboard/inventory" 
            className={linkCls('/staff-dashboard/inventory')}
            onClick={onCloseSidebar}
          >
            <Package className="h-4 w-4" /> Inventory
          </Link>
          
          {isManager && (
            <Link 
              to="/staff-dashboard/reports" 
              className={linkCls('/staff-dashboard/reports')}
              onClick={onCloseSidebar}
            >
              <BarChart className="h-4 w-4" /> Reports
            </Link>
          )}
        </nav>
      </div>
      
      <div className="p-3 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full flex items-center gap-2 text-slate-300 hover:bg-slate-700 hover:text-white justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default StaffSidebar;
