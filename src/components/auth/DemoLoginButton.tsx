
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
        className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all duration-200 py-2 h-12 shadow-md border-2 border-amber-300"
        disabled={isLoading}
        type="button"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Accessing Demo...
          </>
        ) : (
          <>
            <ExternalLink className="mr-2 h-5 w-5" />
            <span className="font-medium">Try Demo Account</span>
          </>
        )}
      </Button>
      <p className="text-center text-sm text-amber-800 font-medium mt-2 bg-amber-50 p-2 rounded-md border border-amber-200">
        <strong>Recommended:</strong> Use this button for instant access to all features
      </p>
    </div>
  );
};
