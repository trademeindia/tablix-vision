
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useAuthOperations() {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      // Check if this is a demo account
      const isDemoAccount = email.endsWith('@demo.com');
      
      if (isDemoAccount) {
        console.log('Attempting to sign in with demo account:', email);
        
        // For demo accounts, ensure we handle them specially
        localStorage.setItem('demoOverride', 'true');
        console.log('Demo override activated');
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Error signing in:', error.message);
        
        if (isDemoAccount && error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Creating Demo Account',
            description: 'First-time demo access: Creating your account...',
          });
          
          // If demo login fails, try creating the account
          return await createDemoAccount(email, password);
        }
        
        toast({
          title: 'Sign In Failed',
          description: error.message || 'An error occurred while signing in.',
          variant: 'destructive',
        });
      } else if (isDemoAccount) {
        toast({
          title: 'Demo Mode Activated',
          description: 'You now have full access to the demo dashboard.',
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: 'Sign In Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const createDemoAccount = async (email: string, password: string) => {
    try {
      // Extract role from email prefix
      const role = email.split('@')[0].toLowerCase();
      const name = `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          },
        },
      });
      
      if (error) {
        console.error('Error creating demo account:', error.message);
        toast({
          title: 'Demo Account Creation Failed',
          description: error.message || 'Failed to create a demo account.',
          variant: 'destructive',
        });
        return { error };
      }
      
      // If account creation successful, try signing in again
      const { error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (signInError) {
        console.error('Error signing in after demo account creation:', signInError.message);
        toast({
          title: 'Demo Account Created',
          description: 'Account created but sign-in failed. Please try again.',
          variant: 'destructive',
        });
        return { error: signInError };
      }
      
      toast({
        title: 'Demo Account Created',
        description: 'Welcome to the demo! You now have access to all features.',
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error in demo account creation:', error);
      toast({
        title: 'Demo Account Creation Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) {
        console.error('Signup error:', error.message);
        toast({
          title: 'Sign Up Failed',
          description: error.message || 'Failed to create an account.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account created successfully',
          description: 'Please check your email to confirm your account.',
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: 'Sign Up Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Use the absolute URL for the redirect to avoid issues on mobile
      const currentOrigin = window.location.origin;
      const redirectUrl = `${currentOrigin}/auth/callback`;
      
      console.log('Initiating Google sign-in with redirect URL:', redirectUrl);
      
      // Modified to use pkce flow and specific redirectTo option
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          flowType: 'pkce'  // Use PKCE flow for better security
        }
      });
      
      if (error) {
        console.error('Google Sign In error:', error.message);
        toast({
          title: 'Google Sign In Failed',
          description: error.message || 'An error occurred while trying to sign in with Google.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: 'Google Sign In Failed',
        description: 'An unexpected error occurred while trying to sign in with Google.',
        variant: 'destructive',
      });
    }
  };

  const signOut = async () => {
    try {
      // Clear demo override flag
      localStorage.removeItem('demoOverride');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        toast({
          title: 'Sign Out Failed',
          description: error.message || 'An error occurred while trying to sign out.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Sign Out Failed',
        description: 'An unexpected error occurred while trying to sign out.',
        variant: 'destructive',
      });
    }
  };

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
}
