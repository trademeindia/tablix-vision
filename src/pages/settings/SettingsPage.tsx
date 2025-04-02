
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Bell, Users, Globe, Shield, Database, Settings } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  
  const settingCategories = [
    {
      title: "Appearance",
      description: "Customize your restaurant's look and feel",
      icon: <Palette className="h-5 w-5" />,
      path: "/settings/appearance"
    },
    {
      title: "Notifications",
      description: "Manage alerts and notification preferences",
      icon: <Bell className="h-5 w-5" />,
      path: "/settings/notifications"
    },
    {
      title: "User Management",
      description: "Control user access and permissions",
      icon: <Users className="h-5 w-5" />,
      path: "/settings/users"
    },
    {
      title: "Restaurant Profile",
      description: "Edit your restaurant's information",
      icon: <Globe className="h-5 w-5" />,
      path: "/settings/profile"
    },
    {
      title: "Security",
      description: "Configure security settings and access control",
      icon: <Shield className="h-5 w-5" />,
      path: "/settings/security"
    },
    {
      title: "Data & Integrations",
      description: "Manage integrations and data settings",
      icon: <Database className="h-5 w-5" />,
      path: "/settings/integrations"
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-500">Manage your restaurant's settings and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingCategories.map((category, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(category.path)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center mb-2">
                <div className="mr-2 p-2 rounded-full bg-primary/10 text-primary">
                  {category.icon}
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-blue-600">
                Configure settings →
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
