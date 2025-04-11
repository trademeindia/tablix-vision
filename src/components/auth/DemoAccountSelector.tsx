
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
    <div className="mt-6 mb-4">
      <h3 className="text-lg font-semibold text-center mb-4">Demo Accounts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {demoAccounts.map((account) => (
          <Card key={account.role} className={`hover:shadow-md transition-shadow ${account.role === 'owner' ? 'border-green-300 bg-green-50' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0">
                  {account.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{account.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{account.description}</p>
                </div>
                <Button 
                  size="sm" 
                  variant={account.role === 'owner' ? "default" : "outline"}
                  className={`ml-2 flex-shrink-0 ${account.role === 'owner' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => onSelectDemo({
                    email: account.email,
                    password: account.password,
                    role: account.role
                  })}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    account.role === 'owner' ? "Access" : "Try"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 text-xs text-center text-slate-500">
        Click on any demo account above to instantly access the dashboard
      </div>
    </div>
  );
};

export default DemoAccountSelector;
