
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import { AuthForm, AuthFormFooter, InputGroup, InputIconWrapper } from '@/components/auth/AuthForm';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import FormError from '@/components/auth/FormError';
import LoadingButton from '@/components/auth/LoadingButton';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message);
        console.error('Reset password error:', error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageWrapper title="Reset Password">
      <div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        {success ? (
          <Alert className="p-4 bg-green-50 text-green-700 rounded-md mb-4">
            <CheckCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Password reset email sent. Please check your inbox.
            </AlertDescription>
          </Alert>
        ) : (
          <AuthForm onSubmit={handleSubmit} className="mt-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
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
          </AuthForm>
        )}
        
        <AuthFormFooter>
          <Link 
            to="/auth/login" 
            className="flex items-center justify-center text-sm text-slate-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </AuthFormFooter>
      </div>
    </AuthPageWrapper>
  );
};

export default ResetPasswordPage;
