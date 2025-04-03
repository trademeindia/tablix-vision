
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, FormItem, FormControl, FormMessage 
} from '@/components/ui/form';
import { Upload, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StaffFormData } from '@/types/staff';

interface ProfileImageUploadProps {
  form: UseFormReturn<StaffFormData>;
  existingImage?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ form, existingImage }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  
  // Set preview URL from existing image if available
  useEffect(() => {
    if (existingImage) {
      setPreviewUrl(existingImage);
      setShowFallback(false);
    } else {
      setPreviewUrl(null);
      setShowFallback(true);
    }
  }, [existingImage]);
  
  // Handle file selection for profile image
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      form.setError('profile_image', {
        type: 'manual',
        message: 'Image size must be less than 2MB'
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      form.setError('profile_image', {
        type: 'manual',
        message: 'File must be an image'
      });
      return;
    }
    
    // Update the form value with the selected file
    form.setValue('profile_image', file);
    form.clearErrors('profile_image');
    
    // Create preview URL for the selected image
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setShowFallback(false);
    
    // Clean up the object URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  // Clear the selected image
  const clearImage = () => {
    form.setValue('profile_image', null);
    if (previewUrl && !existingImage) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setShowFallback(true);
  };

  // Generate initials for avatar fallback
  const getInitials = () => {
    const name = form.watch('name');
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Handle image load error
  const handleImageError = () => {
    console.log(`Failed to load avatar image: ${previewUrl || existingImage}`);
    setShowFallback(true);
  };

  return (
    <div className="mb-6 flex flex-col items-center">
      <Avatar className="h-24 w-24 mb-3">
        {!showFallback && (previewUrl || existingImage) && (
          <AvatarImage 
            src={previewUrl || existingImage || ''} 
            alt="Staff avatar" 
            onError={handleImageError}
          />
        )}
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col items-center gap-2">
        <FormField
          control={form.control}
          name="profile_image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex flex-col gap-2 items-center">
                  <label 
                    htmlFor="profile-image-upload" 
                    className="cursor-pointer flex items-center gap-2 border rounded-md px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Profile Image</span>
                    <input
                      {...field}
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileSelect}
                    />
                  </label>
                  
                  {(previewUrl || existingImage) && (
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearImage}
                      className="text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProfileImageUpload;
