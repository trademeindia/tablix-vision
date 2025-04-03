
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
  const existingImage = existingStaff?.avatar_url || existingStaff?.avatar || existingStaff?.image || undefined;
  
  return (
    <>
      <ProfileImageUpload form={form} existingImage={existingImage} />
      <FormFields form={form} />
    </>
  );
};

export default StaffForm;
