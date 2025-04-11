
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getRedirectPathByRole } from './use-redirect-paths';
import { validateRole } from './role-utils';

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
  const [role, setRole] = useState<string>('owner');

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    console.log('Role changed to:', newRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Attempting to sign in with email:', email);
      
      // Store selected role for proper redirection after authentication
      if (role) {
        localStorage.setItem('selectedRole', role);
        console.log('Saved selected role for redirection:', role);
      }
      
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Failed to sign in. Please check your credentials.');
        setIsSubmitting(false);
        // Clear selected role on error
        localStorage.removeItem('selectedRole');
        return;
      }
      
      // Role-based redirect will happen in the auth context after user roles are loaded
      console.log('Sign-in successful, redirection will happen based on user role');
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
      // Clear selected role on error
      localStorage.removeItem('selectedRole');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Store selected role for proper redirection after authentication
      if (role) {
        localStorage.setItem('selectedRole', role);
        console.log('Saved selected role for Google auth redirection:', role);
      }
      
      await signInWithGoogle();
      // Redirect will be handled by the OAuth callback
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Google Sign-In Failed",
        description: "There was a problem signing in with Google. Please try again.",
        variant: "destructive",
      });
      // Clear selected role on error
      localStorage.removeItem('selectedRole');
    }
  };
  
  const handleDemoLogin = async (demoCredentials: { email: string; password: string; role: string }) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Attempting demo login for role:', demoCredentials.role);
      
      // Validate the role
      const validatedRole = validateRole(demoCredentials.role);
      
      if (!validatedRole) {
        setError(`Invalid role: ${demoCredentials.role}`);
        setIsSubmitting(false);
        return;
      }
      
      // Store the role for proper redirection
      localStorage.setItem('selectedRole', validatedRole);
      
      // First try to sign in with demo account credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoCredentials.email,
        password: demoCredentials.password
      });

      // If sign in successful, redirect to appropriate page
      if (signInData?.user) {
        console.log('Demo login successful for existing account');
        
        // Show toast notification for successful demo login
        toast({
          title: 'Demo Mode Activated',
          description: `You're now viewing the application as a ${validatedRole}.`,
        });

        // Redirect will happen automatically through the auth context
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
              full_name: `Demo ${validatedRole.charAt(0).toUpperCase() + validatedRole.slice(1)}`,
              role: validatedRole, // Store role in user metadata
            },
          }
        });
        
        if (signUpError) {
          console.error('Demo account creation error:', signUpError);
          
          if (signUpError.message.includes('User already registered')) {
            setError('This demo account already exists but could not be accessed. Please try a different demo account or contact support.');
            setIsSubmitting(false);
            // Clear selected role on error
            localStorage.removeItem('selectedRole');
            return;
          }
          
          setError(signUpError.message || 'Failed to create demo account');
          setIsSubmitting(false);
          // Clear selected role on error
          localStorage.removeItem('selectedRole');
          return;
        }
        
        // If account was created successfully, try signing in again
        if (signUpData?.user) {
          console.log('Demo account created, attempting login again');
          
          // Wait a moment for the account to be fully registered
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: secondSignInData, error: secondSignInError } = await supabase.auth.signInWithPassword({
            email: demoCredentials.email,
            password: demoCredentials.password
          });
          
          if (secondSignInError) {
            console.error('Demo login after signup error:', secondSignInError);
            
            // Special handling for email confirmation requirements
            if (secondSignInError.message.includes('Email not confirmed')) {
              setError('Demo accounts require email confirmation to be disabled in your Supabase project settings.');
              
              toast({
                title: 'Demo Account Setup Required',
                description: 'Please check that email confirmation is disabled in the Supabase project settings.',
                variant: 'destructive',
              });
              setIsSubmitting(false);
              // Clear selected role on error
              localStorage.removeItem('selectedRole');
              return;
            }
            
            setError(secondSignInError.message || 'Failed to sign in with demo account');
            setIsSubmitting(false);
            // Clear selected role on error
            localStorage.removeItem('selectedRole');
            return;
          }
          
          // If second login successful
          if (secondSignInData?.user) {
            console.log('Second login attempt successful for new demo account');
            
            // Show success toast
            toast({
              title: 'Demo Mode Activated',
              description: `You're now viewing the application as a ${validatedRole}.`,
            });
            
            // Redirect will happen automatically through the auth context
            return;
          }
        }
      }
      
    } catch (error) {
      console.error('Demo login error:', error);
      setError('An unexpected error occurred. Please try again.');
      // Clear selected role on error
      localStorage.removeItem('selectedRole');
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
