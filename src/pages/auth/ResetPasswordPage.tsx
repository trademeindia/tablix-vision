
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { AuthForm, AuthFormHeader } from '@/components/auth/AuthForm';
import LoadingButton from '@/components/auth/LoadingButton';
import FormError from '@/components/auth/FormError';
import { InputGroup, InputIconWrapper } from '@/components/auth/AuthForm';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        console.error('Reset password error:', error);
        setError(error.message || 'Failed to send reset password email.');
        return;
      }
      
      setSuccess('Reset password email sent. Please check your inbox.');
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageWrapper title="Reset Password">
      <AuthFormHeader 
        title="Reset Password"
        description="Enter your email address to receive a password reset link"
      />
      
      <AuthForm onSubmit={handleSubmit} className="mt-4">
        {error && <FormError message={error} />}
        {success && (
          <div className="flex items-center gap-2 rounded-md bg-green-100 p-2 text-sm text-green-600">
            <p>{success}</p>
          </div>
        )}
        
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <InputIconWrapper>
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputIconWrapper>
        </InputGroup>
        
        <LoadingButton 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
          loadingText="Sending reset link..."
        >
          Send Reset Link
        </LoadingButton>
        
        <div className="flex justify-center mt-4">
          <Link to="/auth/login" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </AuthForm>
    </AuthPageWrapper>
  );
};

export default ResetPasswordPage;
