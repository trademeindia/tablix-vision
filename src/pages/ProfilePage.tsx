
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from '@/components/profile/ProfileForm';
import AccountSettingsForm from '@/components/profile/AccountSettingsForm';
import DeleteAccountDialog from '@/components/profile/DeleteAccountDialog';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();

  // Debug info
  useEffect(() => {
    console.log('ProfilePage rendered with auth state:', { user, loading });
  }, [user, loading]);

  // Simple error handler to prevent crashes
  const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      console.error("Error rendering component:", error);
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error rendering component</AlertTitle>
          <AlertDescription>Please check the console for details.</AlertDescription>
        </Alert>
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <Skeleton className="h-10 w-48 mb-6" />
          <Card className="p-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-4">
              {Array(5).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
          
          {user ? (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <ErrorBoundary>
                  <ProfileForm />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="account">
                <ErrorBoundary>
                  <AccountSettingsForm />
                  <DeleteAccountDialog />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                Please log in to view your profile. For development, authentication checks are bypassed.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default ProfilePage;
