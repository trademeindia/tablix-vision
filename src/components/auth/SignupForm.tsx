
import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, User, UserPlus } from 'lucide-react';
import { AuthForm, AuthFormFooter, AuthDivider, InputGroup, InputIconWrapper } from '@/components/auth/AuthForm';
import LoadingButton from '@/components/auth/LoadingButton';
import FormError from '@/components/auth/FormError';
import PasswordInput from '@/components/auth/PasswordInput';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  name: string;
  setName: (name: string) => void;
  isSubmitting: boolean;
  error: string | null;
  role: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleGoogleSignUp: () => Promise<void>;
}

const SignupForm: React.FC<SignupFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  isSubmitting,
  error,
  role,
  handleSubmit,
  handleGoogleSignUp
}) => {
  return (
    <>
      <AuthForm onSubmit={handleSubmit} className="mt-4">
        <FormError message={error} />
        
        <InputGroup>
          <Label htmlFor="name">Full Name</Label>
          <InputIconWrapper>
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="pl-10"
              value={name}
              onChange={(e) => setName((e.target as HTMLInputElement).value)}
              required
            />
          </InputIconWrapper>
        </InputGroup>
        
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
              onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
              required
            />
          </InputIconWrapper>
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            required
            minLength={6}
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
            required
          />
        </InputGroup>
        
        <LoadingButton 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
          loadingText="Creating account..."
        >
          <span className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Create Account
          </span>
        </LoadingButton>

        <AuthDivider />
        
        <GoogleAuthButton 
          onClick={handleGoogleSignUp}
          text="Sign up with Google"
        />
      </AuthForm>
      
      <AuthFormFooter>
        <p className="text-sm text-center text-slate-600">
          Already have an account?{' '}
          <Link to={`/auth/login?role=${role}`} className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </AuthFormFooter>
    </>
  );
};

export default SignupForm;
