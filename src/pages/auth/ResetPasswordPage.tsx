
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        console.error('Reset password error:', error);
        toast({
          title: 'Reset Password Failed',
          description: error.message || 'Failed to send reset password email.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Reset Password Email Sent',
        description: 'Please check your email for a password reset link.',
      });
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | Menu 360</title>
      </Helmet>
      
      <div className="flex min-h-screen bg-slate-50">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-primary">Menu 360</h1>
              <p className="text-slate-600 mt-2">The Complete Restaurant Management Platform</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Reset Password</CardTitle>
                <CardDescription className="text-center">
                  Enter your email address to receive a password reset link
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
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
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-transparent"></span>
                        Sending reset link...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              </CardContent>
              
              <CardFooter className="flex justify-center">
                <Link to="/auth/login" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
