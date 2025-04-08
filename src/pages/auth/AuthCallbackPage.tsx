
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Spinner from '@/components/ui/spinner';
import { Helmet } from 'react-helmet-async';
import { UserRole } from '@/hooks/use-user-role';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Processing authentication...');
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Checking authentication session...');
        console.log('Auth callback started - checking for session');

        // Get the access token from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        // Handle Google OAuth flow
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        console.log('Session retrieved:', data.session ? 'Valid session' : 'No session');
        setStatus('Session retrieved. Checking user profile...');
        
        // Check user roles to determine redirect
        if (data.session?.user) {
          const userId = data.session.user.id;
          console.log('User authenticated:', userId);
          
          // Get user profile with role
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            
            // If user doesn't have a profile yet, create one
            if (profileError.code === 'PGRST116') { // record not found
              setStatus('Creating new user profile...');
              console.log('Creating new profile for user');
              
              // Create a new profile with default customer role
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: userId,
                  role: 'customer',
                  full_name: data.session.user.user_metadata.full_name || '',
                  avatar_url: data.session.user.user_metadata.avatar_url || '',
                });
              
              if (insertError) {
                console.error('Error creating profile:', insertError);
                throw new Error('Failed to create user profile');
              }
              
              console.log('Created new profile. Redirecting to customer menu.');
              setStatus('Profile created. Redirecting...');
              
              // Redirect to customer page
              navigate('/customer/menu');
              return;
            } else {
              throw profileError;
            }
          }
            
          if (profileData) {
            console.log('User profile found:', profileData);
            setStatus('User profile found. Redirecting...');
            
            // Redirect based on role
            const role = profileData.role as UserRole;
            const redirectPath = 
              role === 'customer' ? '/customer/menu' :
              role === 'waiter' ? '/staff-dashboard/orders' :
              role === 'chef' ? '/staff-dashboard/kitchen' :
              role === 'manager' || role === 'owner' ? '/dashboard' : '/';
              
            console.log(`Redirecting to ${redirectPath} based on role ${role}`);
            navigate(redirectPath);
            return;
          } else {
            console.log('No profile data found, redirecting to default path');
            // No profile data found, redirect to default
            navigate('/customer/menu');
            return;
          }
        } else {
          console.log('No session, redirecting to login');
          setStatus('No authenticated session found');
          setError('No authenticated session found. Please try signing in again.');
          setTimeout(() => navigate('/auth/login'), 3000);
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message || 'Authentication failed');
        setStatus('Authentication error occurred');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Authenticating... | Menu 360</title>
      </Helmet>
      
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          {error ? (
            <div className="text-center">
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg">Authentication Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <p className="text-slate-600 mt-4">Redirecting to login page...</p>
            </div>
          ) : (
            <div className="text-center">
              <Spinner size="lg" className="mb-6" />
              <h1 className="text-xl font-semibold text-slate-800 mb-2">{status}</h1>
              <p className="text-slate-500 mt-2">
                Please wait while we complete your authentication...
              </p>
              {!isProcessing && (
                <div className="mt-4 text-left p-3 bg-slate-50 rounded text-sm font-mono overflow-auto max-h-32">
                  <p className="text-slate-500 mb-2 text-xs">Debug info:</p>
                  <p className="text-slate-700">Current URL: {window.location.href}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthCallbackPage;
