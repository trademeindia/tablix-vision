
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Spinner from '@/components/ui/spinner';
import { Helmet } from 'react-helmet-async';
import { UserRole } from '@/hooks/use-user-role';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getRedirectPathByRole } from '@/hooks/auth/use-redirect-paths';
import { useToast } from '@/hooks/use-toast';

const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Processing authentication...');
  const [isProcessing, setIsProcessing] = useState(true);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Checking authentication session...');
        console.log('Auth callback started - checking for session');

        // Handle Google OAuth flow
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        // Save debug info
        setDebugInfo({
          hasSession: !!data.session,
          hasUser: !!data.session?.user,
          provider: data.session?.user?.app_metadata?.provider || 'none',
          email: data.session?.user?.email || 'none',
        });
        
        console.log('Session retrieved:', data.session ? 'Valid session' : 'No session');
        setStatus('Session retrieved. Checking user profile...');
        
        // Check user roles to determine redirect
        if (data.session?.user) {
          const userId = data.session.user.id;
          console.log('User authenticated:', userId);
          
          // Check if there was a selected role from the login page
          const selectedRole = localStorage.getItem('selectedRole');
          if (selectedRole) {
            console.log('Found selected role in localStorage:', selectedRole);
            
            // Validate the role to ensure it's a valid UserRole
            const validRoles = ['owner', 'manager', 'chef', 'waiter', 'staff', 'customer'];
            const validatedRole = validRoles.includes(selectedRole) ? selectedRole : 'customer';
            
            // Set the user role in localStorage for immediate use
            let roles: UserRole[] = [validatedRole as UserRole];
            // Add implied roles
            if (validatedRole === 'owner') roles.push('manager');
            if (validatedRole === 'chef' || validatedRole === 'waiter') roles.push('staff');
            
            localStorage.setItem('userRole', JSON.stringify(roles));
            localStorage.removeItem('selectedRole'); // Clean up
            
            // For Google auth users, set demo override to true to avoid permission issues
            if (data.session.user.app_metadata.provider === 'google') {
              console.log('Google auth detected, enabling demo override');
              localStorage.setItem('demoOverride', 'true');
            }
            
            // Show toast notification for successful login
            toast({
              title: 'Login Successful',
              description: `Welcome to your ${validatedRole} dashboard!`,
            });
            
            const redirectPath = getRedirectPathByRole(validatedRole);
            console.log(`Redirecting to ${redirectPath} based on selected role ${validatedRole}`);
            navigate(redirectPath);
            return;
          }
          
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
              
              // Update localStorage with role for immediate use
              localStorage.setItem('userRole', JSON.stringify(['customer']));
              
              // Show welcome toast
              toast({
                title: 'Welcome to Menu 360!',
                description: 'Your account has been created successfully.',
              });
              
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
            
            // Set the user role in localStorage for immediate use
            let roles: UserRole[] = [role];
            // Add implied roles
            if (role === 'owner') roles.push('manager');
            if (role === 'chef' || role === 'waiter') roles.push('staff');
            
            localStorage.setItem('userRole', JSON.stringify(roles));
            
            // For Google auth users, set demo override to true to avoid permission issues
            if (data.session.user.app_metadata.provider === 'google') {
              console.log('Google auth detected, enabling demo override');
              localStorage.setItem('demoOverride', 'true');
            }
            
            // Show welcome toast
            toast({
              title: 'Login Successful',
              description: `Welcome to your ${role} dashboard!`,
            });
            
            const redirectPath = getRedirectPathByRole(role);
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
        
        // Update debug info with error details
        setDebugInfo(prev => ({
          ...prev,
          error: error.message,
          errorCode: error.code || 'unknown',
        }));
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate, toast]);

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
                  {Object.entries(debugInfo).map(([key, value]) => (
                    <p key={key} className="text-slate-700">{key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
                  ))}
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
