
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <>
      <AuthForm onSubmit={handleSubmit} className="mt-4">
        <FormError message={error} />
        
        <InputGroup>
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
          <InputIconWrapper>
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-10 bg-white transition-all border-slate-300 focus-visible:border-primary/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </InputIconWrapper>
        </InputGroup>
        
        <InputGroup>
          <div className="flex justify-between flex-wrap">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
            <Link to="/auth/reset-password" className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors">
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
          className="w-full px-4 py-2 mt-4 bg-primary hover:bg-primary/90 transition-colors"
          isLoading={isSubmitting}
          loadingText="Signing in..."
        >
          <span className="flex items-center gap-2 justify-center">
            <LogIn className="h-4 w-4" />
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
        <p className="text-sm text-center text-slate-600 mt-4">
          Don't have an account?{' '}
          <Link to={`/auth/signup?role=${role}`} className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </AuthFormFooter>
    </>
  );
};

export default LoginForm;
