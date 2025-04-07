
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useSession } from '@/hooks/use-session';
import { useUserRole, UserRole } from '@/hooks/use-user-role';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRoles: UserRole[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null; data?: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any | null; data?: any }>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  signOut: () => Promise<{ error: any | null }>;
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
  const [lastUserId, setLastUserId] = useState<string | null>(null);

  // Fetch user roles whenever the user changes
  useEffect(() => {
    const loadUserRoles = async () => {
      try {
        if (user) {
          console.log("Auth context: User detected, fetching roles");
          
          // Prevent duplicate role fetching for same user
          if (lastUserId !== user.id) {
            console.log("User changed, fetching new roles");
            setLastUserId(user.id);
            await fetchUserRoles(user.id);
          } else {
            console.log("Using cached roles for current user");
          }
        } else {
          console.log("Auth context: No user detected");
          setLastUserId(null);
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
      } finally {
        // We always set loading to false, regardless of whether we have a user or not
        setLoading(false);
      }
    };

    // Only wait for roles if we have a user or session loading finished
    if (!sessionLoading) {
      loadUserRoles();
    }
  }, [user, sessionLoading, fetchUserRoles, lastUserId]);

  const value = {
    user,
    session,
    userRoles,
    loading: sessionLoading || loading,
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
