
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for handling staff profile image storage operations
 */
export const useStaffStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  
  // Check if bucket exists and create it if it doesn't
  const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
    try {
      // First check if the bucket already exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error checking buckets:', bucketsError);
        return false;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (bucketExists) {
        console.log(`Bucket ${bucketName} already exists`);
        return true;
      }
      
      // Create the bucket if it doesn't exist
      console.log(`Creating bucket: ${bucketName}`);
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 2 * 1024 * 1024, // 2MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return false;
      }
      
      // Create public access policy for the bucket using the edge function
      try {
        // Use environment variables to access Supabase URL and key
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qofbpjdbmisyxysfcyeb.supabase.co';
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZmJwamRibWlzeXh5c2ZjeWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTUxMzIsImV4cCI6MjA1ODQ5MTEzMn0.RqUyHPLxCWUATAufUkXCUN9yczZNBKMQD_wYF4Q3VVA';
        
        const response = await fetch(`${supabaseUrl}/functions/v1/create-storage-policy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ bucket_name: bucketName })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error creating bucket policy via edge function:', errorData);
        } else {
          console.log('Successfully created bucket policy via edge function');
        }
      } catch (policyErr) {
        // If the edge function call fails, log it but continue
        console.warn('Could not create bucket policy via edge function, continuing anyway:', policyErr);
      }
      
      console.log(`Successfully created bucket: ${bucketName}`);
      return true;
    } catch (error) {
      console.error('Unexpected error in ensureBucketExists:', error);
      return false;
    }
  };

  // Upload an image to Supabase Storage
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const bucketName = 'staff-profiles';
    
    try {
      // Ensure the bucket exists
      const bucketExists = await ensureBucketExists(bucketName);
      if (!bucketExists) {
        console.error('Failed to ensure bucket exists');
        throw new Error('Failed to prepare storage bucket for upload');
      }

      // Generate a unique filename to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      console.log(`Uploading file ${fileName} to bucket ${bucketName}`);
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('File uploaded successfully, public URL:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadProfileImage,
    isUploading
  };
};
