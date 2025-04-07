
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Spinner from '@/components/ui/spinner';
import { Helmet } from 'react-helmet-async';
import { UserRole } from '@/hooks/use-user-role';
import { getRedirectPathByRole } from '@/hooks/auth/use-redirect-paths';

const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the access token from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (!accessToken) {
          console.log('Processing auth callback...');
          // Let Supabase handle the OAuth callback
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          // Check user roles to determine redirect
          if (data.session?.user) {
            // Get user profile with role
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.session.user.id)
              .single();
              
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              
              // If user doesn't have a profile yet, create one
              if (profileError.code === 'PGRST116') { // record not found
                // Create a new profile with default customer role
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: data.session.user.id,
                    role: 'customer',
                    full_name: data.session.user.user_metadata.full_name || '',
                    avatar_url: data.session.user.user_metadata.avatar_url || '',
                  });
                
                if (insertError) {
                  console.error('Error creating profile:', insertError);
                }
                
                // Redirect to customer page
                navigate('/customer/menu');
                return;
              }
            }
              
            if (profileData && profileData.role) {
              // Redirect based on role
              const role = profileData.role as UserRole;
              const redirectPath = getRedirectPathByRole(role);
              
              navigate(redirectPath);
              return;
            }
          }
          
          // Default redirect if no role is found
          navigate('/');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message || 'Authentication failed');
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Authenticating... | Menu 360</title>
      </Helmet>
      
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        {error ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
            <p className="text-slate-700 mb-4">{error}</p>
            <p className="text-slate-500">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="text-center">
            <Spinner size="lg" className="mb-4" />
            <h1 className="text-xl font-semibold text-slate-800">Completing authentication...</h1>
            <p className="text-slate-500 mt-2">Please wait while we redirect you</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthCallbackPage;
