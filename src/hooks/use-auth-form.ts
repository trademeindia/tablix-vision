
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UseLoginFormProps {
  redirectTo?: string;
}

export const useLoginForm = ({ redirectTo = '/' }: UseLoginFormProps = {}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<string>(searchParams.get('role') || 'customer');

  useEffect(() => {
    // Set initial role from URL parameter
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      setIsSubmitting(false);
      return;
    }
    
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
                          role === 'waiter' ? '/staff-dashboard/orders' :
                          role === 'owner' ? '/dashboard' : redirectTo;
      
      toast({
        title: 'Login successful',
        description: 'You have been logged in successfully.',
      });
      
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect will be handled by the OAuth callback
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    error,
    role,
    handleRoleChange,
    handleSubmit,
    handleGoogleSignIn,
  };
};

interface UseSignupFormProps {
  redirectTo?: string;
}

export const useSignupForm = ({ redirectTo = '/auth/login' }: UseSignupFormProps = {}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<string>(searchParams.get('role') || 'customer');

  useEffect(() => {
    // Set initial role from URL parameter
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
  };

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
    
    // Basic validation
    if (!email || !password || !name) {
      setError('All fields are required');
      return;
    }
    
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
      
      navigate(redirectTo);
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      // Redirect will be handled by the OAuth callback
    } catch (error) {
      console.error('Google sign up error:', error);
      setError('Failed to sign up with Google. Please try again.');
    }
  };

  return {
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
    validatePassword,
    handleSubmit,
    handleGoogleSignUp,
  };
};
