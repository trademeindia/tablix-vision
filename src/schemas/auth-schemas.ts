
import { z } from 'zod';

// Base schema for both login and signup forms
const baseSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .transform(email => email.trim().toLowerCase()),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
});

// Login schema with better error messages
export const loginSchema = baseSchema;

// Signup schema includes password confirmation
export const signupSchema = baseSchema.extend({
  confirmPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Legacy schema for backward compatibility
export const authFormSchema = baseSchema.extend({
  confirmPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .optional()
});

// Export types for all schemas
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type AuthFormValues = z.infer<typeof authFormSchema>;
