
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useSession } from '@/hooks/use-session';
import { useUserRole, UserRole } from '@/hooks/use-user-role';

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
  
  const { userRoles, fetchUserRoles } = useUserRole();
  const [rolesLoading, setRolesLoading] = useState(true);
  const loading = sessionLoading || rolesLoading;

  // Fetch user roles whenever the user changes
  useEffect(() => {
    const loadUserRoles = async () => {
      if (user) {
        try {
          await fetchUserRoles(user.id);
        } catch (error) {
          console.error("Error fetching user roles:", error);
        } finally {
          setRolesLoading(false);
        }
      } else {
        setRolesLoading(false);
      }
    };

    loadUserRoles();
  }, [user, fetchUserRoles]);

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
