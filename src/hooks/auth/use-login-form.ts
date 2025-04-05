
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseLoginFormProps {
  redirectTo?: string;
}

export const useLoginForm = ({ redirectTo = '/' }: UseLoginFormProps = {}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [role, setRole] = useState<string>('customer');

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
  };

  const getRedirectPath = (userRole: string) => {
    return userRole === 'customer' ? '/customer/menu' :
           userRole === 'staff' ? '/staff-dashboard' :
           userRole === 'chef' ? '/staff-dashboard/kitchen' :
           userRole === 'waiter' ? '/staff-dashboard/orders' : '/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Failed to sign in. Please check your credentials.');
        return;
      }
      
      // Redirect based on role parameter or to home page
      const redirectPath = getRedirectPath(role);
      
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    // Redirect will be handled by the OAuth callback
  };
  
  const handleDemoLogin = async (demoCredentials: { email: string; password: string; role: string }) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      // First try to sign in with demo account credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoCredentials.email,
        password: demoCredentials.password
      });

      // If sign in successful, redirect to appropriate page
      if (signInData?.user) {
        // Show toast notification for successful demo login
        toast({
          title: 'Demo Mode Activated',
          description: `You're now viewing the application as a ${demoCredentials.role}.`,
        });

        // Redirect based on demo account role
        const redirectPath = getRedirectPath(demoCredentials.role);
        navigate(redirectPath);
        return;
      }
      
      // If the user doesn't exist, create a new demo account
      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // Create new demo user with auto-confirmation (bypassing email verification)
        // Using the admin API would be better but not possible in the browser context
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: demoCredentials.email,
          password: demoCredentials.password,
          options: {
            data: {
              full_name: `Demo ${demoCredentials.role.charAt(0).toUpperCase() + demoCredentials.role.slice(1)}`,
            },
            // We need to rely on the Supabase project having email confirmation disabled for this to work
          }
        });
        
        if (signUpError) {
          console.error('Demo account creation error:', signUpError);
          setError(signUpError.message || 'Failed to create demo account');
          return;
        }
        
        // If account was created successfully, try signing in again
        if (signUpData?.user) {
          const { error: secondSignInError } = await supabase.auth.signInWithPassword({
            email: demoCredentials.email,
            password: demoCredentials.password
          });
          
          if (secondSignInError) {
            console.error('Demo login after signup error:', secondSignInError);
            
            // Special handling for email confirmation requirements
            if (secondSignInError.message.includes('Email not confirmed')) {
              setError('Demo accounts require email confirmation. Please check with the administrator to ensure email confirmation is disabled in the Supabase project settings.');
              
              toast({
                title: 'Demo Account Setup Required',
                description: 'The demo account needs to be pre-configured by an administrator.',
                variant: 'destructive',
              });
              return;
            }
            
            setError(secondSignInError.message || 'Failed to sign in with demo account');
            return;
          }
          
          // Show toast notification
          toast({
            title: 'Demo Mode Activated',
            description: `You're now viewing the application as a ${demoCredentials.role}.`,
          });
          
          // Redirect based on demo account role
          const redirectPath = getRedirectPath(demoCredentials.role);
          navigate(redirectPath);
          return;
        }
      } else if (signInError) {
        // Handle other sign-in errors
        console.error('Demo login error:', signInError);
        setError(signInError.message || 'Failed to sign in with demo account.');
        return;
      }
      
    } catch (error) {
      console.error('Demo login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    error,
    role,
    handleRoleChange,
    handleSubmit,
    handleGoogleSignIn,
    handleDemoLogin,
  };
};
