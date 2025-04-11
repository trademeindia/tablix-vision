
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useSession } from '@/hooks/use-session';
import { useUserRole, UserRole } from '@/hooks/use-user-role';
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
  const { 
    user, 
    session, 
    loading: sessionLoading, 
    signIn, 
    signUp, 
    signInWithGoogle, 
    signOut,
    resetPassword,
    updatePassword
  } = useSession();
  
  const { userRoles, fetchUserRoles, loading: rolesLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user roles whenever the user changes
  useEffect(() => {
    const loadUserRoles = async () => {
      if (user) {
        console.log("Auth context: User detected, fetching roles");
        try {
          // Retrieve from localStorage first for immediate use
          const savedRole = localStorage.getItem('userRole');
          if (savedRole) {
            console.log("Auth context: Found saved role in localStorage");
          }
          
          // Then fetch latest from backend as well
          await fetchUserRoles(user.id);
          
          // Show toast notification for successful login with role
          if (!loading && userRoles.length > 0) {
            const primaryRole = userRoles[0].charAt(0).toUpperCase() + userRoles[0].slice(1);
            toast({
              title: `Welcome, ${primaryRole}`,
              description: `You've successfully logged in to the ${primaryRole} dashboard.`,
            });
          }
        } catch (error) {
          console.error("Error fetching user roles:", error);
        }
      } else {
        console.log("Auth context: No user detected");
      }
      
      // We always set loading to false, regardless of whether we have a user or not
      setLoading(false);
    };

    // Only wait for roles if we have a user
    if (!sessionLoading) {
      loadUserRoles();
    }
  }, [user, sessionLoading, fetchUserRoles, loading, userRoles, toast]);

  // Listen for demo override
  useEffect(() => {
    const demoOverride = localStorage.getItem('demoOverride');
    if (demoOverride === 'true') {
      console.log("Demo override is active");
    }
  }, []);

  // Handle clean logout
  const handleSignOut = async () => {
    // Clear any saved role data
    localStorage.removeItem('userRole');
    localStorage.removeItem('demoOverride');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Perform supabase signout
    return signOut();
  };

  const value = {
    user,
    session,
    userRoles,
    loading: sessionLoading || loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut: handleSignOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Re-export UserRole type for convenience
export type { UserRole };
