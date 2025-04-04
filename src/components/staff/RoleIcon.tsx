
import React from 'react';
import { 
  ChefHat, 
  UserCog, 
  Clipboard, 
  Users2,
  LucideIcon
} from 'lucide-react';

interface RoleIconProps {
  role: string;
  className?: string;
}

const RoleIcon: React.FC<RoleIconProps> = ({ role, className = "h-5 w-5" }) => {
  let Icon: LucideIcon;
  let color: string;
  
  switch (role?.toLowerCase()) {
    case 'chef':
      Icon = ChefHat;
      color = 'text-amber-500';
      break;
    case 'manager':
      Icon = UserCog;
      color = 'text-blue-500';
      break;
    case 'waiter':
      Icon = Clipboard;
      color = 'text-green-500';
      break;
    case 'receptionist':
      Icon = Users2;
      color = 'text-purple-500';
      break;
    default:
      Icon = Users2;
      color = 'text-slate-500';
  }
  
  return <Icon className={`${className} ${color} transition-colors duration-200`} />;
};

export default RoleIcon;
