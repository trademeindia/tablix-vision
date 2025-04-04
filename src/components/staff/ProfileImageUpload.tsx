
// Updated version of the ProfileImageUpload component
import React, { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaffFormData } from '@/types/staff';

interface ProfileImageUploadProps {
  form: UseFormReturn<StaffFormData>;
  existingImage?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ form, existingImage }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const getInitials = (name: string = "Staff Member"): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      form.setValue('profile_image', file);
      
      // Generate a preview URL
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      form.setValue('profile_image', file);
      
      // Generate a preview URL
      const fileReader = new FileReader();
      fileReader.onload = (evt) => {
        setPreviewUrl(evt.target?.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    form.setValue('profile_image', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const formValue = form.watch('name') || 'Staff';
  
  return (
    <FormField
      control={form.control}
      name="profile_image"
      render={({ field: { onChange, ...field } }) => (
        <FormItem className="flex flex-col items-center mb-6">
          <FormLabel className="text-center mb-2">Profile Image</FormLabel>
          <FormControl>
            <div
              className={`relative w-32 h-32 cursor-pointer ${isDragging ? 'ring-2 ring-primary' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <Avatar className="w-32 h-32 border-4 border-slate-100 shadow-md">
                <AvatarImage 
                  src={previewUrl || undefined} 
                  alt="Profile preview" 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 text-xl font-semibold">
                  {getInitials(formValue)}
                </AvatarFallback>
              </Avatar>
              
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 rounded-full transition-opacity duration-200">
                <Camera className="w-8 h-8 text-white" />
              </div>
              
              {previewUrl && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </FormControl>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            {...field}
          />
          
          <p className="text-sm text-center text-muted-foreground mt-2">
            Click or drag and drop to upload
          </p>
        </FormItem>
      )}
    />
  );
};

export default ProfileImageUpload;
