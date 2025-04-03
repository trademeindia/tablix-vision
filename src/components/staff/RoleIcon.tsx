
import React from 'react';
import { ChefHat, HelpCircle, UserCog, User } from 'lucide-react';

interface RoleIconProps {
  role: string;
  className?: string; // Make className optional
}

const RoleIcon: React.FC<RoleIconProps> = ({ role, className }) => {
  const baseClass = className || "h-4 w-4 mr-1";
  
  switch (role.toLowerCase()) {
    case 'chef':
      return <ChefHat className={`${baseClass} text-amber-500`} />;
    case 'manager':
      return <UserCog className={`${baseClass} text-blue-500`} />;
    case 'waiter':
      return <User className={`${baseClass} text-green-500`} />;
    default:
      return <HelpCircle className={`${baseClass} text-gray-500`} />;
  }
};

export default RoleIcon;
