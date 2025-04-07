
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getRedirectPathByRole } from './use-redirect-paths';

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
  const [role, setRole] = useState<string>('customer');

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
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
        setIsSubmitting(false);
        return;
      }
      
      // Redirect based on role parameter or to home page
      const redirectPath = getRedirectPathByRole(role);
      
      toast.success('Login successful!');
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError('Google sign in failed. Please try again.');
      }
      // Redirect will be handled by the OAuth callback
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Google sign in failed. Please try again.');
    }
  };
  
  const handleDemoLogin = async (demoCredentials: { email: string; password: string; role: string }) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Attempting demo login for role:', demoCredentials.role);
      toast.loading('Logging in with demo account...', { id: 'demo-login' });
      
      // First try to sign in with demo account credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoCredentials.email,
        password: demoCredentials.password
      });

      // If sign in successful, redirect to appropriate page
      if (signInData?.user) {
        console.log('Demo login successful:', signInData.user);
        
        // Ensure user metadata contains the role
        if (!signInData.user.user_metadata?.role) {
          console.log('Demo user lacks role in metadata, updating with:', demoCredentials.role);
          
          // Update the user metadata with the role
          const { error: updateError } = await supabase.auth.updateUser({
            data: { role: demoCredentials.role }
          });
          
          if (updateError) {
            console.error('Error updating user role:', updateError);
          }
        }
        
        // Dismiss loading toast and show success
        toast.dismiss('demo-login');
        toast.success(`You're now viewing the application as a ${demoCredentials.role}.`);

        // Add a small delay before redirect to ensure state updates
        setTimeout(() => {
          // Redirect based on demo account role
          const redirectPath = getRedirectPathByRole(demoCredentials.role);
          console.log('Redirecting to:', redirectPath);
          navigate(redirectPath);
        }, 100);
        return;
      }
      
      // If the login failed, create a new demo account
      if (signInError) {
        console.log('Demo login failed, attempting to create account:', signInError.message);
        
        // Create new demo user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: demoCredentials.email,
          password: demoCredentials.password,
          options: {
            data: {
              full_name: `Demo ${demoCredentials.role.charAt(0).toUpperCase() + demoCredentials.role.slice(1)}`,
              role: demoCredentials.role, // Store role in user metadata
            },
          }
        });
        
        if (signUpError) {
          console.error('Demo account creation error:', signUpError);
          toast.dismiss('demo-login');
          
          if (signUpError.message.includes('User already registered')) {
            setError('This demo account already exists but could not be accessed. Please try a different demo account or contact support.');
            toast.error('Demo login failed: This account exists but could not be accessed.');
            setIsSubmitting(false);
            return;
          }
          
          setError(signUpError.message || 'Failed to create demo account');
          toast.error('Demo account creation failed: ' + (signUpError.message || 'Unknown error'));
          setIsSubmitting(false);
          return;
        }
        
        // If account was created successfully, try signing in again
        if (signUpData?.user) {
          console.log('Demo account created, attempting login again');
          
          // Wait a moment for the account to be fully registered
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data: secondSignInData, error: secondSignInError } = await supabase.auth.signInWithPassword({
            email: demoCredentials.email,
            password: demoCredentials.password
          });
          
          if (secondSignInError) {
            console.error('Demo login after signup error:', secondSignInError);
            toast.dismiss('demo-login');
            
            // Special handling for email confirmation requirements
            if (secondSignInError.message.includes('Email not confirmed')) {
              setError('Demo accounts require email confirmation to be disabled in your Supabase project settings.');
              
              toast.error('Demo Account Setup Required: Please check that email confirmation is disabled in the Supabase project settings.');
              setIsSubmitting(false);
              return;
            }
            
            setError(secondSignInError.message || 'Failed to sign in with demo account');
            toast.error('Demo login failed: ' + (secondSignInError.message || 'Unknown error'));
            setIsSubmitting(false);
            return;
          }
          
          // If second login successful
          if (secondSignInData?.user) {
            console.log('Second login attempt successful for new demo account');
            
            // Dismiss loading toast and show success
            toast.dismiss('demo-login');
            toast.success(`You're now viewing the application as a ${demoCredentials.role}.`);
            
            // Add a small delay before redirect to ensure state updates
            setTimeout(() => {
              // Redirect based on demo account role
              const redirectPath = getRedirectPathByRole(demoCredentials.role);
              console.log('Redirecting to:', redirectPath);
              navigate(redirectPath);
            }, 100);
            return;
          }
        }
      }
      
      // If we reached here, something went wrong that wasn't caught in other conditions
      toast.dismiss('demo-login');
      toast.error('Demo login failed with an unexpected error');
      setError('Demo login failed. Please try again or contact support.');
    } catch (error) {
      console.error('Demo login error:', error);
      toast.dismiss('demo-login');
      toast.error('An unexpected error occurred during demo login');
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
