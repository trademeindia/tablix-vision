
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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { toast } = useToast();
  
  // Track if this is an intentional login (not just page load)
  const [isIntentionalLogin, setIsIntentionalLogin] = useState<boolean>(false);

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
          
          // Check the current URL path
          const currentPath = window.location.pathname;
          
          // Only show welcome toast if:
          // 1. We are not on the landing page (/) or menu360 page
          // 2. This is not the initial page load (prevents auto-redirect)
          // 3. This appears to be an intentional login
          const isLandingPage = currentPath === '/' || currentPath === '/menu360';
          
          if (!isLandingPage && initialLoadComplete && userRoles.length > 0 && isIntentionalLogin) {
            // Make sure we have a valid role before using it
            const primaryRole = userRoles[0] ? 
              userRoles[0].charAt(0).toUpperCase() + userRoles[0].slice(1) : 
              'User';
              
            toast({
              title: `Welcome, ${primaryRole}`,
              description: `You've successfully logged in to the ${primaryRole} dashboard.`,
            });
            
            // Reset intentional login flag
            setIsIntentionalLogin(false);
          }
        } catch (error) {
          console.error("Error fetching user roles:", error);
          // Show welcome toast only for intentional logins
          if (initialLoadComplete && isIntentionalLogin) {
            toast({
              title: `Welcome back`,
              description: `You've successfully logged in to your dashboard.`,
            });
            // Reset intentional login flag
            setIsIntentionalLogin(false);
          }
        }
      } else {
        console.log("Auth context: No user detected");
      }
      
      // We always set loading to false, regardless of whether we have a user or not
      setLoading(false);
      // Set initial load complete after the first auth check
      if (!initialLoadComplete) {
        setInitialLoadComplete(true);
      }
    };

    // Only wait for roles if we have a user
    if (!sessionLoading) {
      loadUserRoles();
    }
  }, [user, sessionLoading, fetchUserRoles, loading, userRoles, toast, initialLoadComplete, isIntentionalLogin]);

  // Intercept signIn, signUp, and signInWithGoogle to set intentional login flag
  const enhancedSignIn = async (email: string, password: string) => {
    setIsIntentionalLogin(true);
    return signIn(email, password);
  };
  
  const enhancedSignUp = async (email: string, password: string, name: string) => {
    setIsIntentionalLogin(true);
    return signUp(email, password, name);
  };
  
  const enhancedSignInWithGoogle = async () => {
    setIsIntentionalLogin(true);
    return signInWithGoogle();
  };

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
    localStorage.removeItem('selectedRole');
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
    signIn: enhancedSignIn,
    signUp: enhancedSignUp,
    signInWithGoogle: enhancedSignInWithGoogle,
    signOut: handleSignOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Re-export UserRole type for convenience
export type { UserRole };
