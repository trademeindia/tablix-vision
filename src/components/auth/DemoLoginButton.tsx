
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';

interface DemoLoginButtonProps {
  isLoading: boolean;
  onDemoLogin: () => void;
}

export const DemoLoginButton: React.FC<DemoLoginButtonProps> = ({
  isLoading,
  onDemoLogin
}) => {
  return (
    <div className="mb-6">
      <Button 
        onClick={onDemoLogin} 
        className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all duration-200 py-2 h-11"
        disabled={isLoading}
        type="button"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Accessing Demo...
          </>
        ) : (
          <>
            <ExternalLink className="mr-2 h-4 w-4" />
            Try Demo Account
          </>
        )}
      </Button>
      <p className="text-center text-xs text-gray-500 mt-2">
        No sign up required - instant access to all features
      </p>
    </div>
  );
};
