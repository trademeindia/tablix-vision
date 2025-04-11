
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, ShoppingBag, Users, ChefHat } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { getRedirectPathByRole } from '@/hooks/auth/use-redirect-paths';

const Index = () => {
  const { user, userRoles, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users based on their roles
  useEffect(() => {
    if (!loading && user) {
      // Check user roles and redirect accordingly
      if (userRoles.length > 0) {
        const primaryRole = userRoles[0];
        const redirectPath = getRedirectPathByRole(primaryRole);
        navigate(redirectPath);
      } else {
        // Default to customer menu if no roles are found
        navigate('/customer/menu');
      }
    }
  }, [user, userRoles, loading, navigate]);

  // For users who directly navigate to /index, redirect them to the root landing page
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                The complete restaurant management solution with digital menu, QR ordering, and operations dashboard
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow border-green-300 bg-green-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <Utensils className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Restaurant Owner</CardTitle>
                  <CardDescription>Complete management dashboard</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-6 text-slate-600">
                    Access all restaurant management features.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                    <Link to="/auth/login?role=owner">Access as Owner</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow border-orange-300 bg-orange-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <ChefHat className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle>Kitchen Chef</CardTitle>
                  <CardDescription>Kitchen order management</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-6 text-slate-600">
                    Manage kitchen operations and orders.
                  </p>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/auth/login?role=chef">Access as Chef</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow border-blue-300 bg-blue-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Restaurant Staff</CardTitle>
                  <CardDescription>Order & service management</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-6 text-slate-600">
                    Manage orders and customer service.
                  </p>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/auth/login?role=waiter">Access as Waiter</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow border-amber-300 bg-amber-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle>Customer</CardTitle>
                  <CardDescription>Menu browsing & ordering</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-6 text-slate-600">
                    Browse menu and place orders.
                  </p>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/auth/login?role=customer">Access as Customer</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-slate-600 mb-6">
                Choose one of the roles above to explore the dashboard with a demo account.
                <br />No sign-up required!
              </p>
              <Button variant="outline" asChild>
                <Link to="/menu360">Learn More About Menu 360</Link>
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
