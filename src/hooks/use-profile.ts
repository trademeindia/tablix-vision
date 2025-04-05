
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/profile';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from './use-toast';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch profile on component mount or when user changes
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async (): Promise<Profile | null> => {
    if (!user) {
      console.log('No authenticated user found. Cannot fetch profile.');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching profile for user ID:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (!data) {
        console.log('Profile not found, creating a new one');
        // If no profile exists, create one
        return await createProfile(user.id);
      }
      
      console.log('Profile fetched successfully:', data);
      const fetchedProfile = data as Profile;
      setProfile(fetchedProfile);
      return fetchedProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching profile:', errorMessage, err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const newProfile: Partial<Profile> = {
        id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) throw error;

      console.log('Profile created successfully:', data);
      setProfile(data as Profile);
      return data as Profile;
    } catch (err) {
      console.error('Error creating profile:', err);
      return null;
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; data?: Profile; error?: Error }> => {
    if (!user) {
      return { success: false, error: new Error('No authenticated user found') };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        // Update local state
        setProfile(data as Profile);
        
        toast({
          title: 'Profile updated',
          description: 'Your profile changes were saved successfully.',
        });
        
        return { success: true, data: data as Profile };
      } else {
        throw new Error('No profile data returned after update');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error updating profile:', err);
      
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      });
      
      return { 
        success: false, 
        error: err instanceof Error ? err : new Error('An unknown error occurred')
      };
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (file: File): Promise<{ publicUrl?: string; error?: Error }> => {
    if (!user) {
      return { error: new Error('No authenticated user found') };
    }
    
    if (!file) {
      return { error: new Error('No file provided') };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `profiles/${user.id}/${fileName}`;
      
      console.log('Uploading profile image to path:', filePath);
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      console.log('Upload successful:', uploadData);
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData?.publicUrl;
      
      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }
      
      console.log('Public URL:', publicUrl);
      
      // Update the user's profile with the new image URL
      await updateProfile({
        avatar_url: publicUrl
      });
      
      return { publicUrl };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error uploading profile image:', err);
      
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your profile image.',
        variant: 'destructive',
      });
      
      return { 
        error: err instanceof Error ? err : new Error('An unknown error occurred')
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: Error }> => {
    if (!user) {
      return { success: false, error: new Error('No authenticated user found') };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // First, delete user data from the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Then try to delete the user from auth (this may fail in development mode)
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
        if (authError) console.warn("Couldn't delete auth user:", authError);
      } catch (authErr) {
        console.warn("Couldn't delete auth user, may need admin rights:", authErr);
      }
      
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error deleting account:', err);
      
      toast({
        title: 'Account deletion failed',
        description: 'There was an error deleting your account.',
        variant: 'destructive',
      });
      
      return { 
        success: false, 
        error: err instanceof Error ? err : new Error('An unknown error occurred')
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    profile,
    fetchProfile,
    updateProfile,
    uploadProfileImage,
    deleteAccount,
  };
};
