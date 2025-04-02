
import { z } from 'zod';

// Validation schema with better error messages
export const authFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .transform(email => email.trim().toLowerCase()),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
});

export type AuthFormValues = z.infer<typeof authFormSchema>;
