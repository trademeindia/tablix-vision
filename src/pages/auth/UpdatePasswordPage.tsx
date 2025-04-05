
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthForm, InputGroup } from '@/components/auth/AuthForm';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { Label } from '@/components/ui/label';
import FormError from '@/components/auth/FormError';
import LoadingButton from '@/components/auth/LoadingButton';
import PasswordInput from '@/components/auth/PasswordInput';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('Update password error:', error);
        setError(error.message || 'Failed to update password. Please try again.');
      } else {
        // Redirect to login page on success
        navigate('/auth/login');
      }
    } catch (err) {
      console.error('Unexpected error during password update:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageWrapper title="Update Password">
      <div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Update Password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Create a new secure password for your account
          </p>
        </div>
        
        <AuthForm onSubmit={handleSubmit} className="mt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <InputGroup>
            <Label htmlFor="password">New Password</Label>
            <PasswordInput
              id="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your new password"
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
      </div>
    </AuthPageWrapper>
  );
};

export default UpdatePasswordPage;
