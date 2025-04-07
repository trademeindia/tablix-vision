
import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, LogIn } from 'lucide-react';
import { AuthForm, AuthFormFooter, AuthDivider, InputGroup, InputIconWrapper } from '@/components/auth/AuthForm';
import LoadingButton from '@/components/auth/LoadingButton';
import FormError from '@/components/auth/FormError';
import PasswordInput from '@/components/auth/PasswordInput';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isSubmitting: boolean;
  error: string | null;
  role: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  error,
  role,
  handleSubmit,
  handleGoogleSignIn
}) => {
  return (
    <>
      <AuthForm onSubmit={handleSubmit} className="mt-6 space-y-6">
        <FormError message={error} />
        
        <InputGroup>
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
          <InputIconWrapper>
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-10 h-12 border-slate-200 focus:border-primary rounded-md shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputIconWrapper>
        </InputGroup>
        
        <InputGroup>
          <div className="flex justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
            <Link to="/auth/reset-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputGroup>
        
        <LoadingButton 
          type="submit" 
          className="w-full h-12 text-base font-medium shadow-md" 
          isLoading={isSubmitting}
          loadingText="Signing in..."
        >
          <span className="flex items-center justify-center gap-2">
            <LogIn className="h-5 w-5" />
            Sign in
          </span>
        </LoadingButton>

        <AuthDivider />
        
        <GoogleAuthButton 
          onClick={handleGoogleSignIn}
          text="Sign in with Google"
        />
      </AuthForm>
      
      <AuthFormFooter>
        <p className="text-sm text-center text-slate-600">
          Don't have an account?{' '}
          <Link to={`/auth/signup?role=${role}`} className="font-medium text-primary hover:text-primary/80 transition-colors">
            Sign up
          </Link>
        </p>
      </AuthFormFooter>
    </>
  );
};

export default LoginForm;
