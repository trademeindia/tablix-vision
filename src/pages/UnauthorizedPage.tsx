
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const UnauthorizedPage = () => {
  return (
    <>
      <Helmet>
        <title>Access Denied | Menu 360</title>
      </Helmet>
      
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">Access Denied</AlertTitle>
            <AlertDescription className="mt-2">
              You do not have permission to access this page.
            </AlertDescription>
          </Alert>
          
          <p className="text-center text-slate-500 mb-6">
            Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link to="/" className="flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth/login">Login with a different account</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
