
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';

interface AuthPageWrapperProps {
  title: string;
  children: React.ReactNode;
}

const AuthPageWrapper = ({ title, children }: AuthPageWrapperProps) => {
  return (
    <>
      <Helmet>
        <title>{title} | Menu 360</title>
      </Helmet>
      
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full sm:mx-auto sm:max-w-md">
            <Card className="shadow-xl overflow-hidden border-0 animate-fade-in">
              <div className="bg-white p-8 rounded-lg">
                {children}
              </div>
            </Card>
            
            <p className="text-center mt-8 text-sm text-slate-500">
              © {new Date().getFullYear()} Menu 360. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPageWrapper;
