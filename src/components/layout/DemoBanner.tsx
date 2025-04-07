
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface DemoBannerProps {
  role: string;
}

const DemoBanner: React.FC<DemoBannerProps> = ({ role }) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  if (!isVisible) {
    return null;
  }

  const handleExitDemo = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const roleText = 
    role === 'owner' ? 'Restaurant Owner' :
    role === 'manager' ? 'Restaurant Manager' :
    role === 'staff' ? 'Staff Member' :
    role === 'chef' ? 'Kitchen Chef' :
    role === 'waiter' ? 'Waiter' :
    'Customer';

  return (
    <div className="bg-amber-100 border-b border-amber-200 text-amber-800 py-2 px-4 sticky top-0 z-50 w-full">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs md:text-sm font-medium">
            ⚡ Demo Mode: You're viewing the application as a {roleText}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleExitDemo}
            className="text-xs md:text-sm h-7 px-2 text-amber-800 hover:text-amber-900 hover:bg-amber-200"
          >
            Exit Demo
          </Button>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-amber-800 hover:text-amber-900 rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
