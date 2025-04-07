
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useSession } from '@/hooks/use-session';
import { useUserRole, UserRole } from '@/hooks/use-user-role';
import { toast } from 'sonner';

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
  refreshUserRoles: () => Promise<UserRole[]>;
  initialized: boolean;
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
    initialized: sessionInitialized,
    signIn, 
    signUp, 
    signInWithGoogle, 
    signOut: baseSignOut,
    resetPassword,
    updatePassword
  } = useSession();
  
  const { userRoles, fetchUserRoles, loading: rolesLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [lastUserId, setLastUserId] = useState<string | null>(null);
  const [roleRefreshAttempts, setRoleRefreshAttempts] = useState(0);
  const [roleRefreshTimer, setRoleRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Enhanced sign out function that cleans up local state
  const signOut = async () => {
    try {
      console.log("Starting sign out process");
      setIsSigningOut(true);
      
      // Clear any role-related localStorage items first
      localStorage.removeItem('lastUserRole');
      
      // Clear any existing retry timers
      if (roleRefreshTimer) {
        clearTimeout(roleRefreshTimer);
        setRoleRefreshTimer(null);
      }
      
      // Reset component state
      setLastUserId(null);
      setRoleRefreshAttempts(0);
      
      // Actually sign out from Supabase
      const result = await baseSignOut();
      
      if (!result.error) {
        console.log("Sign out successful");
        toast.success('You have been logged out successfully');
      } else {
        console.error("Error during sign out:", result.error);
        toast.error('An error occurred during sign out: ' + (result.error.message || 'Please try again'));
      }
      
      setIsSigningOut(false);
      return result;
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error('An error occurred during sign out');
      setIsSigningOut(false);
      return { error };
    }
  };

  // Fetch user roles whenever the user changes
  useEffect(() => {
    const loadUserRoles = async () => {
      try {
        if (user && !isSigningOut) {
          console.log("Auth context: User detected, fetching roles for", user.email);
          
          // Clear any existing retry timers
          if (roleRefreshTimer) {
            clearTimeout(roleRefreshTimer);
            setRoleRefreshTimer(null);
          }
          
          // Check for demo account - special handling to avoid role confusion
          if (user.email?.endsWith('@demo.com')) {
            const savedRole = localStorage.getItem('lastUserRole');
            if (!savedRole) {
              // If no role found in localStorage for a demo account,
              // extract it from email pattern
              const email = user.email.toLowerCase();
              const roleFromEmail = email.includes('owner') ? 'owner' :
                                   email.includes('chef') ? 'chef' :
                                   email.includes('waiter') ? 'waiter' :
                                   email.includes('staff') ? 'staff' : 'customer';
              
              console.log("Demo account without saved role, setting from email pattern:", roleFromEmail);
              localStorage.setItem('lastUserRole', roleFromEmail);
            }
          }
          
          // Prevent duplicate role fetching for same user
          if (lastUserId !== user.id) {
            console.log("User changed, fetching new roles");
            setLastUserId(user.id);
            await fetchUserRoles(user.id);
            setRoleRefreshAttempts(0); // Reset attempts when successful
          } else {
            console.log("Using cached roles for current user", user.email);
          }
        } else {
          console.log("Auth context: No user detected");
          setLastUserId(null);
          
          // Clear any existing retry timers when user is logged out
          if (roleRefreshTimer) {
            clearTimeout(roleRefreshTimer);
            setRoleRefreshTimer(null);
          }
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
        
        // Retry role fetching if failed (maximum 3 attempts)
        if (roleRefreshAttempts < 3 && user && !isSigningOut) {
          console.log(`Retrying role fetch (attempt ${roleRefreshAttempts + 1}/3)`);
          setRoleRefreshAttempts(prev => prev + 1);
          
          const timer = setTimeout(() => {
            fetchUserRoles(user.id).catch(e => 
              console.error("Retry failed:", e)
            );
          }, 2000); // Retry after 2 seconds
          
          setRoleRefreshTimer(timer);
        }
      } finally {
        // We always set loading to false, regardless of whether we have a user or not
        setLoading(false);
        if (sessionInitialized) {
          setInitialized(true);
        }
      }
    };

    // Only wait for roles if we have a user or session loading finished
    if (!sessionLoading) {
      loadUserRoles();
    }
    
    return () => {
      // Cleanup timer on unmount
      if (roleRefreshTimer) {
        clearTimeout(roleRefreshTimer);
      }
    };
  }, [user, sessionLoading, sessionInitialized, fetchUserRoles, lastUserId, roleRefreshAttempts, roleRefreshTimer, isSigningOut]);

  // Function to manually refresh user roles
  const refreshUserRoles = async (): Promise<UserRole[]> => {
    if (!user) {
      console.warn("Cannot refresh roles: No user logged in");
      toast.error("Cannot refresh roles: You are not logged in");
      return [];
    }
    
    try {
      console.log("Manually refreshing user roles for:", user.email);
      setLoading(true); // Show loading state during manual refresh
      
      // Clear role from localStorage to force a fresh fetch
      localStorage.removeItem('lastUserRole');
      
      const roles = await fetchUserRoles(user.id);
      console.log("Refreshed roles:", roles);
      
      if (roles.length === 0) {
        toast.warning("No roles assigned to this user");
      } else {
        toast.success(`Roles refreshed: ${roles.join(', ')}`);
      }
      
      return roles;
    } catch (error) {
      console.error("Error refreshing user roles:", error);
      toast.error("Failed to refresh user roles");
      return userRoles; // Return current roles on failure
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    userRoles,
    loading: sessionLoading || loading,
    initialized,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    refreshUserRoles,
  };

  // Debug auth state in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Auth Provider State:", {
        user: user ? { id: user.id, email: user.email } : null,
        userRoles,
        loading: sessionLoading || loading,
        initialized,
        sessionLoading,
        rolesLoading,
        lastRole: localStorage.getItem('lastUserRole')
      });
    }
  }, [user, userRoles, sessionLoading, loading, rolesLoading, initialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Re-export UserRole type for convenience
export type { UserRole };
