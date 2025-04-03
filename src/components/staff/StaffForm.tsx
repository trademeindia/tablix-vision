
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { StaffFormData } from '@/types/staff';
import ProfileImageUpload from './ProfileImageUpload';
import FormFields from './FormFields';

interface StaffFormProps {
  form: UseFormReturn<StaffFormData>;
}

const StaffForm: React.FC<StaffFormProps> = ({ form }) => {
  return (
    <>
      <ProfileImageUpload form={form} />
      <FormFields form={form} />
    </>
  );
};

export default StaffForm;
