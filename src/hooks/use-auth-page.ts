
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/constants/auth-constants';
import { toast } from '@/hooks/use-toast';

export const useAuthPage = () => {
  const { isLoading, isAuthenticated, authInitialized, checkSession, signIn } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [isLongLoadingState, setIsLongLoadingState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to access
  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    const handleDemoLoginSuccess = () => {
      console.log('Demo login success event received, redirecting to dashboard');
      setIsRedirecting(true);
      
      // Short delay before redirect
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    };
    
    window.addEventListener('demo-login-success', handleDemoLoginSuccess);
    
    return () => {
      window.removeEventListener('demo-login-success', handleDemoLoginSuccess);
    };
  }, [navigate]);

  // Set a timeout to show additional message if loading takes too long
  useEffect(() => {
    let longLoadingTimeout: NodeJS.Timeout;
    
    if (isLoading && !isLongLoadingState) {
      longLoadingTimeout = setTimeout(() => {
        setIsLongLoadingState(true);
      }, 3000);
    }
    
    return () => {
      if (longLoadingTimeout) clearTimeout(longLoadingTimeout);
    };
  }, [isLoading, isLongLoadingState]);

  // Check session only once on initial render
  useEffect(() => {
    let mounted = true;
    
    // Only check session if authentication is initialized but user is not authenticated yet
    if (authInitialized && !isAuthenticated && !isLoading && !hasCheckedSession) {
      const verifyAuth = async () => {
        try {
          console.log('AuthPage: Verifying session...');
          await checkSession();
        } finally {
          if (mounted) {
            setHasCheckedSession(true);
          }
        }
      };
      
      verifyAuth();
    }
    
    // For testing: Auto sign-in with demo account in development
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('autoDemo') === 'true' && !isAuthenticated && !isLoading && hasCheckedSession) {
      const tryAutoDemo = async () => {
        try {
          console.log('Attempting auto demo login');
          toast({
            title: 'Auto Demo Login',
            description: 'Logging in with the demo account...'
          });
          
          await signIn(DEMO_EMAIL, DEMO_PASSWORD);
        } catch (error) {
          console.error('Auto demo login failed:', error);
        }
      };
      
      setTimeout(tryAutoDemo, 1000);
    }
    
    return () => {
      mounted = false;
    };
  }, [authInitialized, isAuthenticated, isLoading, checkSession, hasCheckedSession, location.search, signIn]);

  // Handle redirect after authentication with debouncing
  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;
    
    // Only proceed with redirect logic once auth is initialized and not loading
    if (authInitialized && !isLoading && hasCheckedSession) {
      if (isAuthenticated && !isRedirecting) {
        // Set a flag to show redirect UI and prevent duplicate redirects
        setIsRedirecting(true);
        
        // Add a small delay before redirecting to avoid UI flickering
        redirectTimeout = setTimeout(() => {
          console.log('Authentication successful, redirecting to:', from);
          navigate(from, { replace: true });
        }, 800); // Longer delay to allow animations to complete
      }
    }
    
    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [isAuthenticated, navigate, from, isLoading, authInitialized, hasCheckedSession, isRedirecting]);

  // Emergency reset option for users stuck in loading state
  const handleEmergencyReset = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('Emergency reset: Storage cleared');
      
      // Also attempt to clear cookies
      try {
        await fetch('/api/auth/clear-session', { 
          method: 'POST',
          credentials: 'include'
        });
      } catch (e) {
        console.warn('Failed to clear session via API:', e);
      }
      
      toast({
        title: 'Storage Reset',
        description: 'Browser storage cleared. Please try signing in again.'
      });
      window.location.reload();
    } catch (error) {
      console.error('Error during emergency reset:', error);
    }
  };

  return {
    isLoading,
    isRedirecting,
    hasCheckedSession,
    isAuthenticated,
    authInitialized,
    isLongLoadingState,
    handleEmergencyReset
  };
};
