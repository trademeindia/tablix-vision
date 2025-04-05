
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Users, ShoppingBag } from 'lucide-react';

interface DemoAccountSelectorProps {
  onSelectDemo: (credentials: { email: string; password: string; role: string }) => void;
}

const DemoAccountSelector: React.FC<DemoAccountSelectorProps> = ({ onSelectDemo }) => {
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
      role: 'staff',
      title: 'Restaurant Staff',
      description: 'Access the staff dashboard with order management',
      icon: <Users className="h-8 w-8 text-blue-600" />,
      email: 'staff@demo.com',
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {demoAccounts.map((account) => (
          <Card key={account.role} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  {account.icon}
                </div>
                <h4 className="font-semibold mb-1">{account.title}</h4>
                <p className="text-sm text-slate-500 text-center mb-4">{account.description}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onSelectDemo({
                    email: account.email,
                    password: account.password,
                    role: account.role
                  })}
                >
                  Try {account.title}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DemoAccountSelector;
