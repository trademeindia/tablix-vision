
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Users, ChefHat, ShoppingBag, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DemoAccountSelectorProps {
  onSelectDemo: (credentials: { email: string; password: string; role: string }) => void;
  isLoading?: boolean;
}

const DemoAccountSelector: React.FC<DemoAccountSelectorProps> = ({ onSelectDemo, isLoading = false }) => {
  const [selectedAccount, setSelectedAccount] = React.useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const demoAccounts = [
    { 
      role: 'owner',
      title: 'Restaurant Owner',
      description: 'Access the complete restaurant management dashboard',
      icon: <Utensils className="h-8 w-8 text-green-600" />,
      email: 'owner@demo.com',
      password: 'demo123'
    },
    {
      role: 'chef',
      title: 'Kitchen Chef',
      description: 'Access the kitchen dashboard with order management',
      icon: <ChefHat className="h-8 w-8 text-red-600" />,
      email: 'chef@demo.com',
      password: 'demo123'
    },
    {
      role: 'waiter',
      title: 'Restaurant Waiter',
      description: 'Access the waiter interface for orders and tables',
      icon: <Users className="h-8 w-8 text-blue-600" />,
      email: 'waiter@demo.com',
      password: 'demo123'
    },
    {
      role: 'customer',
      title: 'Customer',
      description: 'Browse menu and place orders as a customer',
      icon: <ShoppingBag className="h-8 w-8 text-amber-600" />,
      email: 'customer@demo.com',
      password: 'demo123'
    }
  ];

  const handleClick = (account: any) => {
    setSelectedAccount(account.role);
    onSelectDemo({
      email: account.email,
      password: account.password,
      role: account.role
    });
  };

  return (
    <div className="mt-8 mb-6">
      <h3 className="text-lg font-semibold text-center mb-4">Demo Accounts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {demoAccounts.map((account) => (
          <Card 
            key={account.role} 
            className={`hover:shadow-md transition-all transform hover:-translate-y-1 duration-200 ${
              selectedAccount === account.role ? 'ring-2 ring-primary shadow-lg' : ''
            }`}
          >
            <CardContent className="pt-6 flex flex-col h-full justify-between">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-3 shadow-sm">
                  {account.icon}
                </div>
                <h4 className="font-semibold mb-1 text-center">{account.title}</h4>
                <p className="text-sm text-slate-500 text-center mb-4">
                  {isMobile ? account.description.split(' ').slice(0, 4).join(' ') + '...' : account.description}
                </p>
              </div>
              <Button 
                size="sm" 
                variant={selectedAccount === account.role ? "default" : "outline"}
                className={`w-full ${selectedAccount === account.role ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => handleClick(account)}
                disabled={isLoading}
              >
                {isLoading && selectedAccount === account.role ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  `Try ${isMobile ? '' : account.title}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 text-xs text-center text-slate-500">
        Note: Demo accounts provide a tour of the interface with limited functionality
      </div>
    </div>
  );
};

export default DemoAccountSelector;
