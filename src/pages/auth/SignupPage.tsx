
import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, User, UserPlus } from 'lucide-react';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { AuthForm, AuthFormHeader, AuthFormFooter, AuthDivider, InputGroup, InputIconWrapper } from '@/components/auth/AuthForm';
import LoadingButton from '@/components/auth/LoadingButton';
import FormError from '@/components/auth/FormError';
import PasswordInput from '@/components/auth/PasswordInput';
import AuthTabs from '@/components/auth/AuthTabs';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { useSignupForm } from '@/hooks/use-auth-form';

const SignupPage = () => {
  const {
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
    handleRoleChange,
    handleSubmit,
    handleGoogleSignUp
  } = useSignupForm();

  return (
    <AuthPageWrapper title="Sign Up">
      <div>
        <AuthTabs defaultRole={role} onChange={handleRoleChange} />
        
        <div>
          <AuthFormHeader 
            title={role === 'customer' ? 'Customer Sign Up' : 
                 role === 'staff' ? 'Staff Sign Up' : 'Owner Sign Up'}
            description="Create a new account to get started"
          />
          
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
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
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
        </div>
      </div>
    </AuthPageWrapper>
  );
};

export default SignupPage;
