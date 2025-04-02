
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
    try {
      // Show loading toast
      toast({
        title: "Accessing Demo",
        description: "Setting up your demo experience...",
      });
      
      // First, try to force-confirm the demo account
      console.log('Attempting to force-confirm demo account before login');
      try {
        const forceConfirmResponse = await fetch('/api/force-confirm-demo', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const forceConfirmData = await forceConfirmResponse.json();
        console.log('Force confirm response:', forceConfirmData);
      } catch (confirmError) {
        console.warn('Force confirm demo had an issue, but continuing:', confirmError);
      }
      
      // Wait a bit for the confirmation to take effect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call the parent's onDemoLogin function to trigger the login
      await onDemoLogin();
      
      // Show success toast
      toast({
        title: "Demo Access Granted",
        description: "Welcome to the Restaurant Dashboard!",
      });
      
      // Force navigation to dashboard
      console.log('Forcing navigation to dashboard');
      
      // Additional delay to ensure auth state is fully processed
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 800);
    } catch (error) {
      console.error('Demo login failed:', error);
      toast({
        title: "Demo Access Failed",
        description: "Please try again in a moment",
        variant: "destructive"
      });
    }
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
