
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { StaffFormData, StaffMember } from '@/types/staff';
import ProfileImageUpload from './ProfileImageUpload';
import FormFields from './FormFields';

interface StaffFormProps {
  form: UseFormReturn<StaffFormData>;
  existingStaff?: StaffMember;
}

const StaffForm: React.FC<StaffFormProps> = ({ form, existingStaff }) => {
  // Get the most reliable image URL from multiple possible fields
  const getExistingImageUrl = (): string | undefined => {
    if (!existingStaff) return undefined;
    
    // Log available image URLs for debugging
    // console.log('Available image URLs for', existingStaff.name, {
      avatar_url: existingStaff.avatar_url,
      avatar: existingStaff.avatar,
      image: existingStaff.image
    });
    
    // Return the first non-empty value
    return existingStaff.avatar_url || existingStaff.avatar || existingStaff.image;
  };
  
  const existingImage = getExistingImageUrl();
  
  return (
    <>
      <ProfileImageUpload form={form} existingImage={existingImage} />
      <FormFields form={form} />
    </>
  );
};

export default StaffForm;
