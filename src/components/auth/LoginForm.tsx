
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Mail, Lock } from 'lucide-react';
import { AuthFormValues } from '@/schemas/auth-schemas';

interface LoginFormProps {
  form: UseFormReturn<AuthFormValues>;
  onSubmit: (values: AuthFormValues) => Promise<void>;
  isLoading: boolean;
  isSignUp: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  form,
  onSubmit,
  isLoading,
  isSignUp
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Email</FormLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <FormControl>
                  <Input 
                    placeholder="your.email@example.com" 
                    type="email" 
                    className="pl-10" 
                    {...field} 
                    disabled={isLoading}
                    aria-disabled={isLoading}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Password</FormLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <FormControl>
                  <Input 
                    placeholder={isSignUp ? "Password (min. 6 characters)" : "Password"} 
                    type="password" 
                    className="pl-10" 
                    {...field} 
                    disabled={isLoading}
                    aria-disabled={isLoading}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isSignUp && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <FormControl>
                    <Input 
                      placeholder="Confirm your password" 
                      type="password" 
                      className="pl-10" 
                      {...field} 
                      disabled={isLoading}
                      aria-disabled={isLoading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button 
          type="submit" 
          className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 py-2 h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSignUp ? "Creating account..." : "Signing in..."}
            </>
          ) : (
            isSignUp ? "Create Account" : "Sign In"
          )}
        </Button>
        
        {isSignUp && (
          <p className="text-xs text-gray-500 mt-1">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        )}
      </form>
    </Form>
  );
};
