
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useAuthOperations() {
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Error signing in:', error.message);
        toast.error(error.message || 'An error occurred while signing in.');
        return { error, data: null };
      }
      
      console.log('Sign in successful for:', email);
      return { error: null, data };
    } catch (error: any) {
      console.error('Unexpected error signing in:', error);
      toast.error('An unexpected error occurred. Please try again.');
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
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
        toast.error(error.message || 'Failed to create an account.');
        return { error, data: null };
      } else {
        toast.success('Account created successfully! Please check your email to confirm your account.');
        console.log('Account created successfully for:', email);
        return { error: null, data };
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error('An unexpected error occurred. Please try again.');
      return { error, data: null };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting to sign in with Google');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        console.error('Google Sign In error:', error.message);
        toast.error(error.message || 'An error occurred while trying to sign in with Google.');
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error('An unexpected error occurred while trying to sign in with Google.');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error.message);
        toast.error(error.message || 'An error occurred while trying to sign out.');
        return { error };
      }
      
      console.log('Sign out successful');
      return { error: null };
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('An unexpected error occurred while trying to sign out.');
      return { error };
    }
  };

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
}
