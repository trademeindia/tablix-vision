
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
      // Clear any previous role data
      localStorage.removeItem('lastUserRole');
      
      console.log('Starting regular login flow with email:', email);
      toast.loading('Logging in...', { id: 'login' });
      
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        toast.dismiss('login');
        toast.error('Login failed: ' + (error.message || 'Please check your credentials'));
        setError(error.message || 'Failed to sign in. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }
      
      // Store the selected role in localStorage for persistence
      localStorage.setItem('lastUserRole', role);
      console.log('Saved role to localStorage:', role);
      
      // Redirect based on role parameter
      const redirectPath = getRedirectPathByRole(role);
      console.log('Login successful, redirecting to:', redirectPath);
      
      toast.dismiss('login');
      toast.success('Login successful!');
      
      // Add small delay to ensure auth state is updated properly
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      toast.dismiss('login');
      toast.error('An unexpected error occurred during login');
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign in flow');
      setIsSubmitting(true);
      toast.loading('Logging in with Google...', { id: 'google-login' });
      
      // Clear any previous role data
      localStorage.removeItem('lastUserRole');
      
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google sign in error:', error);
        toast.dismiss('google-login');
        toast.error('Google sign in failed: ' + (error.message || 'Please try again'));
        setError('Google sign in failed. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      // Set a default role for Google sign-in (we'll update this on callback)
      localStorage.setItem('lastUserRole', 'customer');
      
      // Toast message will be handled by the OAuth callback
      toast.dismiss('google-login');
      
      // Redirect will be handled by the OAuth callback
      setIsSubmitting(false);
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.dismiss('google-login');
      toast.error('An unexpected error occurred during Google login');
      setError('Google sign in failed. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  const handleDemoLogin = async (demoCredentials: { email: string; password: string; role: string }) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Attempting demo login for role:', demoCredentials.role);
      toast.loading('Logging in with demo account...', { id: 'demo-login' });
      
      // Clear previous role from localStorage
      localStorage.removeItem('lastUserRole');
      
      // First try to sign in with demo account credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoCredentials.email,
        password: demoCredentials.password
      });

      // If sign in successful, redirect to appropriate page
      if (signInData?.user) {
        console.log('Demo login successful:', signInData.user);
        
        // Store the role in localStorage for persistence
        localStorage.setItem('lastUserRole', demoCredentials.role);
        console.log('Saved demo role to localStorage:', demoCredentials.role);
        
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

        // Redirect based on demo account role
        const redirectPath = getRedirectPathByRole(demoCredentials.role);
        console.log('Demo login successful, redirecting to:', redirectPath);
        
        // Add small delay to ensure auth state is properly updated
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
          setIsSubmitting(false);
        }, 1000);
        return;
      }
      
      // If the login failed, try creating a new demo account
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
          
          // Store the role in localStorage for persistence
          localStorage.setItem('lastUserRole', demoCredentials.role);
          
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
            
            // Redirect based on demo account role with a delay
            const redirectPath = getRedirectPathByRole(demoCredentials.role);
            console.log('Redirecting to:', redirectPath);
            
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
              setIsSubmitting(false);
            }, 1000);
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
