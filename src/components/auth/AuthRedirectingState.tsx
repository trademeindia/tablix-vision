
import React from 'react';
import Spinner from '@/components/ui/spinner';

export const AuthRedirectingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Spinner size="lg" className="mb-4" />
      <p className="text-gray-600 font-medium">Authentication successful!</p>
      <p className="text-gray-500 text-sm mt-2">Redirecting to dashboard...</p>
    </div>
  );
};
