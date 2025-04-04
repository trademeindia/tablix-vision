
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, LogIn } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { AuthForm, AuthFormHeader, AuthFormFooter, AuthDivider, InputGroup, InputIconWrapper } from '@/components/auth/AuthForm';
import LoadingButton from '@/components/auth/LoadingButton';
import FormError from '@/components/auth/FormError';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = (location.state as any)?.from?.pathname || '/';
  const role = new URLSearchParams(location.search).get('role') || 'customer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Failed to sign in. Please check your credentials.');
        return;
      }
      
      // Redirect based on role parameter or to home page
      const redirectPath = role === 'customer' ? '/customer/menu' :
                          role === 'staff' ? '/staff-dashboard' :
                          role === 'chef' ? '/staff-dashboard/kitchen' :
                          role === 'waiter' ? '/staff-dashboard/orders' : '/';
      
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    // Redirect will be handled by the OAuth callback
  };

  return (
    <AuthPageWrapper title="Login">
      <div>
        <Tabs defaultValue={role} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="owner">Owner</TabsTrigger>
          </TabsList>
          
          <div>
            <AuthFormHeader 
              title={role === 'customer' ? 'Customer Login' : 
                    role === 'staff' ? 'Staff Login' : 'Owner Login'}
              description="Enter your credentials to access your account"
            />
            
            <AuthForm onSubmit={handleSubmit} className="mt-4">
              <FormError message={error} />
              
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
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/auth/reset-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <InputIconWrapper>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              
              <LoadingButton 
                type="submit" 
                className="w-full" 
                isLoading={isSubmitting}
                loadingText="Signing in..."
              >
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </span>
              </LoadingButton>

              <AuthDivider />
              
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handleGoogleSignIn}
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
                Sign in with Google
              </Button>
            </AuthForm>
            
            <AuthFormFooter>
              <p className="text-sm text-center text-slate-600">
                Don't have an account?{' '}
                <Link to={`/auth/signup?role=${role}`} className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </AuthFormFooter>
          </div>
        </Tabs>
      </div>
    </AuthPageWrapper>
  );
};

export default LoginPage;
