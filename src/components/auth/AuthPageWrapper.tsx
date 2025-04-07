
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
      
      <div className="flex min-h-screen bg-slate-50">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-primary">Menu 360</h1>
              <p className="text-slate-600 mt-2">The Complete Restaurant Management Platform</p>
            </div>
            
            <Card className="p-6 shadow-lg">
              {children}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPageWrapper;
