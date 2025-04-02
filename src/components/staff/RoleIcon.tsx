
import React from 'react';
import { ChefHat, HelpCircle, UserCog, User } from 'lucide-react';

interface RoleIconProps {
  role: string;
}

const RoleIcon: React.FC<RoleIconProps> = ({ role }) => {
  switch (role.toLowerCase()) {
    case 'chef':
      return <ChefHat className="h-4 w-4 mr-1 text-amber-500" />;
    case 'manager':
      return <UserCog className="h-4 w-4 mr-1 text-blue-500" />;
    case 'waiter':
      return <User className="h-4 w-4 mr-1 text-green-500" />;
    default:
      return <HelpCircle className="h-4 w-4 mr-1 text-gray-500" />;
  }
};

export default RoleIcon;
