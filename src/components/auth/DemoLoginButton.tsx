
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
      
      // First, try to force-confirm the demo account using absolute path to fix 404 error
      console.log('Attempting to force-confirm demo account before login');
      try {
        const baseUrl = window.location.origin;
        const forceConfirmResponse = await fetch(`${baseUrl}/api/force-confirm-demo`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!forceConfirmResponse.ok) {
          console.warn(`Force confirm returned status ${forceConfirmResponse.status}`);
          // Try the alternative format as fallback
          const fallbackResponse = await fetch(`${baseUrl}/functions/v1/force-confirm-demo`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabase.supabaseKey
            }
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('Force confirm fallback response:', fallbackData);
          } else {
            console.warn(`Force confirm fallback returned status ${fallbackResponse.status}`);
          }
        } else {
          const forceConfirmData = await forceConfirmResponse.json();
          console.log('Force confirm response:', forceConfirmData);
        }
      } catch (confirmError) {
        console.warn('Force confirm demo had an issue, but continuing:', confirmError);
      }
      
      // Wait a bit for the confirmation to take effect
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sign out first to clear any existing sessions
      await supabase.auth.signOut();
      console.log('Signed out any existing sessions');
      
      // Call the parent's onDemoLogin function to trigger the login
      await onDemoLogin();
      
      // Additional delay to ensure auth state is fully processed
      setTimeout(() => {
        // Check if actually authenticated
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            console.log('Successfully authenticated, redirecting to dashboard');
            
            // Show success toast
            toast({
              title: "Demo Access Granted",
              description: "Welcome to the Restaurant Dashboard!",
            });
            
            // Force navigation to dashboard
            navigate('/', { replace: true });
          } else {
            console.log('Not authenticated after login attempt, trying one more time');
            // Try one more direct login attempt
            supabase.auth.signInWithPassword({
              email: 'demo@restaurant.com',
              password: 'demo123456'
            }).then(({ data, error }) => {
              if (error) {
                console.error('Final login attempt failed:', error);
                toast({
                  title: "Demo Login Issue",
                  description: "Please try clicking the button again",
                  variant: "destructive"
                });
              } else if (data.session) {
                console.log('Final login attempt succeeded');
                toast({
                  title: "Demo Access Granted",
                  description: "Welcome to the Restaurant Dashboard!",
                });
                navigate('/', { replace: true });
              }
            });
          }
        });
      }, 1000);
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
