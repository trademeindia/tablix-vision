
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProfile } from '@/hooks/use-profile';
import ProfileForm from '@/components/profile/ProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Spinner from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import DeleteAccountDialog from '@/components/profile/DeleteAccountDialog';
import AccountSettingsForm from '@/components/profile/AccountSettingsForm';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading, error, profile, fetchProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    // Only fetch profile when auth is loaded and user exists
    if (!authLoading && user && !profileLoaded) {
      fetchProfile().then(() => {
        setProfileLoaded(true);
      });
    }
  }, [authLoading, user, fetchProfile, profileLoaded]);

  // Show loading state when either auth is loading or profile is loading but not yet started
  if (authLoading || (loading && !profileLoaded)) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | Menu 360</title>
      </Helmet>

      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm profile={profile} />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSettingsForm user={user} />
            
            <DeleteAccountDialog />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
