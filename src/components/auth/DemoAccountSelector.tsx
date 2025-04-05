
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Users, ChefHat, ShoppingBag, Loader2 } from 'lucide-react';

interface DemoAccountSelectorProps {
  onSelectDemo: (credentials: { email: string; password: string; role: string }) => void;
  isLoading?: boolean;
}

const DemoAccountSelector: React.FC<DemoAccountSelectorProps> = ({ onSelectDemo, isLoading = false }) => {
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

  return (
    <div className="mt-8 mb-4">
      <h3 className="text-lg font-semibold text-center mb-4">Demo Accounts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoAccounts.map((account) => (
          <Card key={account.role} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col h-full">
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  {account.icon}
                </div>
                <h4 className="font-semibold mb-1">{account.title}</h4>
                <p className="text-sm text-slate-500 text-center mb-4 flex-1">{account.description}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onSelectDemo({
                    email: account.email,
                    password: account.password,
                    role: account.role
                  })}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Try ${account.title}`
                  )}
                </Button>
              </div>
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
