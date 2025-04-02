
import React from 'react';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AuthLoadingStateProps {
  isLongLoadingState: boolean;
  handleEmergencyReset: () => void;
}

export const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({
  isLongLoadingState,
  handleEmergencyReset
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Spinner size="lg" className="mb-4" />
      <p className="text-gray-600 font-medium">Checking authentication status...</p>
      <p className="text-gray-500 text-sm mt-2">Just a moment, please</p>
      
      {isLongLoadingState && (
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-sm text-center">
          <p className="text-amber-800 mb-3">Taking longer than expected?</p>
          <Button 
            onClick={handleEmergencyReset}
            className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 rounded-md border border-amber-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Authentication
          </Button>
        </div>
      )}
    </div>
  );
};
