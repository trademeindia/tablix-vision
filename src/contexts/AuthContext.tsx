import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/hooks/use-user-role';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRoles: UserRole[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (password: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>(['customer']); // Default to customer
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check user session on mount and listen for auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    try {
      // First set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          console.log('Auth state changed:', event);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // Don't call fetchUserRoles directly in the listener to avoid potential deadlocks
          if (currentSession?.user) {
            setTimeout(() => {
              fetchUserRoles(currentSession.user.id);
            }, 0);
          } else {
            setUserRoles(['customer']);
            setLoading(false);
          }
        }
      );

      // Then check for existing session
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        console.log('Initial session check:', currentSession ? 'Session exists' : 'No session');
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          fetchUserRoles(currentSession.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error checking session:', error);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error in auth setup:', error);
      setLoading(false);
    }
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      console.log('Fetching user roles for:', userId);
      
      // For now, just set a default role to unblock rendering
      setUserRoles(['customer']);
      setLoading(false);
      
      // Continue with the actual role fetch
      try {
        // First try to get roles from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (profileData && profileData.role) {
          console.log('Found role in profiles:', profileData.role);
          // If role is stored as a string
          if (typeof profileData.role === 'string') {
            setUserRoles([profileData.role as UserRole]);
          } 
          // If role is stored as an array
          else if (Array.isArray(profileData.role)) {
            setUserRoles(profileData.role as UserRole[]);
          }
        } else {
          // Fallback to checking staff table if no role in profiles
          console.log('No profile role found, checking staff table');
          const { data: staffData } = await supabase
            .from('staff')
            .select('role')
            .eq('user_id', userId);
            
          if (staffData && staffData.length > 0) {
            const roles = staffData.map(staff => staff.role as UserRole);
            console.log('Found roles in staff table:', roles);
            setUserRoles(roles);
          } else {
            // Keep default customer role
            console.log('No roles found, defaulting to customer');
          }
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign in error:', error);
      } else {
        console.log('Sign in successful');
      }
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting to sign up with email:', email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (!error) {
        toast({
          title: 'Account created successfully',
          description: 'Please check your email to confirm your account.',
        });
        console.log('Sign up successful');
      } else {
        console.error('Sign up error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting to sign in with Google');
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: 'Google Sign In Failed',
        description: 'An error occurred while trying to sign in with Google.',
        variant: 'destructive',
      });
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out');
      await supabase.auth.signOut();
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Sign Out Failed',
        description: 'An error occurred while trying to sign out.',
        variant: 'destructive',
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Sending password reset email to:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (!error) {
        toast({
          title: 'Password Reset Email Sent',
          description: 'Check your email for a password reset link.',
        });
      } else {
        console.error('Reset password error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      console.log('Updating password');
      const { error } = await supabase.auth.updateUser({ password });
      
      if (!error) {
        toast({
          title: 'Password Updated',
          description: 'Your password has been successfully updated.',
        });
      } else {
        console.error('Update password error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('Error updating password:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    userRoles,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Re-export UserRole type for convenience
export type { UserRole };
