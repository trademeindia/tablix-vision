
import { useAuthState } from './auth/use-auth-state';
import { useAuthOperations } from './auth/use-auth-operations';
import { usePasswordOperations } from './auth/use-password-operations';
import type { UseSessionReturn } from './auth/types';

export const useSession = (): UseSessionReturn => {
  const { user, session, loading } = useAuthState();
  const { signIn, signUp, signInWithGoogle, signOut } = useAuthOperations();
  const { resetPassword, updatePassword } = usePasswordOperations();

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
  };
};
