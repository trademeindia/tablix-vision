
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { AuthForm, AuthFormHeader } from '@/components/auth/AuthForm';
import LoadingButton from '@/components/auth/LoadingButton';
import FormError from '@/components/auth/FormError';
import { InputGroup } from '@/components/auth/AuthForm';
import PasswordInput from '@/components/auth/PasswordInput';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (): boolean => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validatePassword()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('Update password error:', error);
        setError(error.message || 'Failed to update password.');
        return;
      }
      
      // Navigate to login after successful password update
      navigate('/auth/login');
    } catch (error) {
      console.error('Update password error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageWrapper title="Update Password">
      <AuthFormHeader 
        title="Update Password"
        description="Create a new password for your account"
      />
      
      <AuthForm onSubmit={handleSubmit} className="mt-4">
        <FormError message={error} />
        
        <InputGroup>
          <Label htmlFor="password">New Password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </InputGroup>
        
        <LoadingButton 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
          loadingText="Updating password..."
        >
          Update Password
        </LoadingButton>
      </AuthForm>
    </AuthPageWrapper>
  );
};

export default UpdatePasswordPage;
