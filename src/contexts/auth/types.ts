
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  user: User | null;
  authInitialized: boolean;
  checkSession: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
