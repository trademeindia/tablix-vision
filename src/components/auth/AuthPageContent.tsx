
import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { PageTransition } from '@/components/ui/page-transition';

export const AuthPageContent: React.FC = () => {
  return (
    <PageTransition duration={400}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 text-gray-800">
              Restaurant Dashboard
            </h1>
            <p className="text-gray-600 mb-3">Sign in to manage your restaurant operations</p>
            <div className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium">
              Use the "Try Demo Account" button below for instant access!
            </div>
          </div>
          
          <AuthForm />
          
          <p className="mt-8 text-sm text-center text-gray-500">
            Manage menus, orders, and staff all in one place
          </p>
        </div>
      </div>
    </PageTransition>
  );
};
