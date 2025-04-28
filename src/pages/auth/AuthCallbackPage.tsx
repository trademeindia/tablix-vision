import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Spinner from '@/components/ui/spinner';
import { Helmet } from 'react-helmet-async';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getRedirectPathByRole } from '@/hooks/auth/use-redirect-paths';
import { useToast } from '@/hooks/use-toast';
import { validateRole, expandRoles, persistRoles } from '@/hooks/auth/role-utils';

const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Processing authentication...');
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Checking authentication session...');
        // console.log('Auth callback started - checking for session');

        // Handle OAuth flow
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        // console.log('Session retrieved:', data.session ? 'Valid session' : 'No session');
        setStatus('Session retrieved. Checking user profile...');
        
        // Check for successful authentication
        if (data.session?.user) {
          const userId = data.session.user.id;
          // console.log('User authenticated:', userId);
          
          // Check if there was a selected role from the login page
          const selectedRole = localStorage.getItem('selectedRole');
          
          if (selectedRole) {
            // console.log('Found selected role in localStorage:', selectedRole);
            
            // Validate the role
            const validatedRole = validateRole(selectedRole);
            
            if (validatedRole) {
              // Expand roles based on hierarchy and persist them
              const roles = expandRoles(validatedRole);
              persistRoles(roles);
              
              // For Google auth users, set demo override to true to avoid permission issues
              if (data.session.user.app_metadata.provider === 'google') {
                // console.log('Google auth detected, enabling demo override');
                localStorage.setItem('demoOverride', 'true');
              }
              
              // Show toast notification for successful login
              toast({
                title: 'Login Successful',
                description: `Welcome to your ${validatedRole} dashboard!`,
              });
              
              // Get the redirect path based on role and navigate
              const redirectPath = getRedirectPathByRole(validatedRole);
              // console.log(`Redirecting to ${redirectPath} based on selected role ${validatedRole}`);
              
              // Clear the selected role after using it
              localStorage.removeItem('selectedRole');
              
              // Add real-time listener for user presence
              const channel = supabase.channel('online-users');
              await channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                  await channel.track({
                    user: userId,
                    online_at: new Date().toISOString(),
                  });
                }
              });
              
              navigate(redirectPath);
              return;
            } else {
              console.warn('Invalid role found in localStorage:', selectedRole);
              // Clear invalid role
              localStorage.removeItem('selectedRole');
            }
          }
          
          // If no valid selected role, try to get from user metadata or profile
          const userRole = data.session.user.user_metadata?.role || 'customer';
          // console.log('Using role from user metadata:', userRole);
          
          // Expand roles based on hierarchy and persist them
          const roles = expandRoles(userRole);
          persistRoles(roles);
          
          // For Google auth users, set demo override to true to avoid permission issues
          if (data.session.user.app_metadata.provider === 'google') {
            // console.log('Google auth detected, enabling demo override');
            localStorage.setItem('demoOverride', 'true');
          }
          
          // Show toast notification for successful login
          toast({
            title: 'Login Successful',
            description: `Welcome to your dashboard!`,
          });
          
          // Get the redirect path based on role and navigate
          const redirectPath = getRedirectPathByRole(userRole);
          // console.log(`Redirecting to ${redirectPath} based on user metadata role ${userRole}`);
          
          // Add real-time listener for user presence
          const channel = supabase.channel('online-users');
          await channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              await channel.track({
                user: userId,
                online_at: new Date().toISOString(),
              });
            }
          });
          
          navigate(redirectPath);
          return;
        } else {
          // No session found, redirect to login
          // console.log('No session found, redirecting to login');
          navigate('/auth/login');
        }
      } catch (error: any) {
        console.error('Error in auth callback:', error);
        setError(error.message || 'Authentication failed. Please try again.');
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Helmet>
          <title>Authentication Error | Menu 360</title>
        </Helmet>
        
        <Alert variant="destructive" className="max-w-md mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="flex gap-4 mt-4">
          <button 
            onClick={() => navigate('/auth/login')} 
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Return to Login
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <Helmet>
        <title>Authentication in Progress | Menu 360</title>
      </Helmet>
      
      <div className="mb-4">
        <Spinner size="lg" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Authentication in Progress</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">{status}</p>
      
      <p className="text-sm text-gray-500 text-center max-w-md">
        You will be redirected automatically. If you are not redirected within a few seconds, 
        <button 
          onClick={() => navigate('/auth/login')} 
          className="text-primary underline ml-1"
        >
          click here to return to login
        </button>.
      </p>
    </div>
  );
};

export default AuthCallbackPage;
