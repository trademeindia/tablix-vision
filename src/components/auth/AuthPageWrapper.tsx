
import React from 'react';
import { Helmet } from 'react-helmet-async';

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
      
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-1 flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-10 text-center">
            <h1 className="text-3xl font-bold text-primary">Menu 360</h1>
            <p className="text-slate-600 mt-2">The Complete Restaurant Management Platform</p>
          </div>
          
          <div className="w-full sm:mx-auto sm:max-w-md md:max-w-xl lg:max-w-2xl">
            {children}
          </div>
          
          <div className="mt-8 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Menu 360. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPageWrapper;
