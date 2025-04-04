
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, User, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { AuthForm, AuthFormHeader, AuthFormFooter, AuthDivider, InputGroup, InputIconWrapper } from '@/components/auth/AuthForm';
import LoadingButton from '@/components/auth/LoadingButton';
import FormError from '@/components/auth/FormError';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const role = new URLSearchParams(window.location.search).get('role') || 'customer';

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
      const { error } = await signUp(email, password, name);
      
      if (error) {
        console.error('Signup error:', error);
        setError(error.message || 'Failed to create an account.');
        return;
      }
      
      toast({
        title: 'Account created',
        description: 'Please check your email to confirm your account.',
      });
      
      navigate('/auth/login');
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    await signInWithGoogle();
    // Redirect will be handled by the OAuth callback
  };

  return (
    <AuthPageWrapper title="Sign Up">
      <div>
        <Tabs defaultValue={role} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="owner">Owner</TabsTrigger>
          </TabsList>
          
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
                <InputIconWrapper>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </InputIconWrapper>
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <InputIconWrapper>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </InputIconWrapper>
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
              
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handleGoogleSignUp}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </Button>
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
        </Tabs>
      </div>
    </AuthPageWrapper>
  );
};

export default SignupPage;
