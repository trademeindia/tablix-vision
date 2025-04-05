
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
  const { user } = useAuth();
  const { loading, error, profile, fetchProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Fetch profile data when component mounts
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Spinner size="lg" />
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
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                {profile && <ProfileForm profile={profile} />}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Update your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountSettingsForm user={user} />
              </CardContent>
            </Card>
            
            <DeleteAccountDialog />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
