
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, ShoppingBag, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Menu 360 - The Complete Restaurant Management Platform</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Menu 360</h1>
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link to="/menu360">About</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Welcome to Menu 360
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Please select how you'd like to access the system
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Utensils className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Restaurant Owner</CardTitle>
                  <CardDescription>Manage your restaurant</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-6 text-slate-500">
                    Access all restaurant management features, including staff management, menu control, and analytics.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/dashboard">Access Owner Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Restaurant Staff</CardTitle>
                  <CardDescription>Access staff features</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-6 text-slate-500">
                    For waiters, chefs, and other staff members to manage orders, kitchen operations, and service.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/staff-dashboard">Access Staff Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle>Customer</CardTitle>
                  <CardDescription>Browse menu and order</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-6 text-slate-500">
                    Browse restaurant menu, place orders, and manage your customer profile and preferences.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/customer/menu">Access Customer Portal</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-slate-500 mb-4">
                New to Menu 360? Learn more about our complete restaurant management solution.
              </p>
              <Button variant="outline" asChild>
                <Link to="/menu360">Visit Our Website</Link>
              </Button>
            </div>
          </div>
        </main>
        
        <footer className="bg-white border-t border-slate-200 py-6">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Menu 360. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
