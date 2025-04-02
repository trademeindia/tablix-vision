
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DemoLoginButtonProps {
  isLoading: boolean;
  onDemoLogin: () => void;
}

export const DemoLoginButton: React.FC<DemoLoginButtonProps> = ({
  isLoading,
  onDemoLogin
}) => {
  const navigate = useNavigate();
  
  const handleDemoLogin = async () => {
    // Call the onDemoLogin function provided by the parent
    await onDemoLogin();
    
    // After a short delay to ensure the login process has started
    // Force navigation to the dashboard to bypass any potential verification steps
    setTimeout(() => {
      if (!window.location.pathname.startsWith('/')) {
        console.log('Forcing navigation to dashboard after demo login');
        navigate('/', { replace: true });
      }
    }, 1500);
  };
  
  return (
    <div className="mb-2">
      <Button 
        onClick={handleDemoLogin} 
        className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all duration-200 py-2 h-12 shadow-lg border-2 border-amber-300"
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
            <span className="font-semibold">Try Demo Account</span>
          </>
        )}
      </Button>
      <p className="text-center text-sm text-amber-800 font-medium mt-2 bg-amber-50 p-2 rounded-md border border-amber-200">
        <strong>✨ One-Click Access:</strong> No registration or email required
      </p>
    </div>
  );
};
