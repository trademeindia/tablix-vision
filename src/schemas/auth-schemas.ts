
import { z } from 'zod';

// Login schema with better error messages
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .transform(email => email.trim().toLowerCase()),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
});

// Signup schema includes password confirmation
export const signupSchema = loginSchema.extend({
  confirmPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Export the authFormSchema from the existing file for backward compatibility
export { authFormSchema } from './auth-schemas';

// Export types for both schemas
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type AuthFormValues = z.infer<typeof loginSchema> & { confirmPassword?: string };
