
import React from 'react';
import { useAuthPage } from '@/hooks/use-auth-page';
import { AuthLoadingState } from '@/components/auth/AuthLoadingState';
import { AuthRedirectingState } from '@/components/auth/AuthRedirectingState';
import { AuthPageContent } from '@/components/auth/AuthPageContent';

const AuthPage: React.FC = () => {
  const {
    isLoading,
    isRedirecting,
    hasCheckedSession,
    isAuthenticated,
    authInitialized,
    isLongLoadingState,
    handleEmergencyReset
  } = useAuthPage();

  // Show loading state while authentication is initializing or verifying
  if (!authInitialized || isLoading || (!hasCheckedSession && !isAuthenticated)) {
    return (
      <AuthLoadingState 
        isLongLoadingState={isLongLoadingState}
        handleEmergencyReset={handleEmergencyReset}
      />
    );
  }
  
  // Show redirect state
  if (isRedirecting) {
    return <AuthRedirectingState />;
  }

  // Show the auth form
  return <AuthPageContent />;
};

export default AuthPage;
