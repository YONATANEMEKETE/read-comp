import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  rememberMe: z.boolean().default(false).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const uploadBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  author: z.string().min(1, 'Author is required').max(255),
  thumbnailUrl: z.string().url('Invalid thumbnail URL'),
  pdfUrl: z.string().url('Invalid PDF URL'),
  totalPages: z.number().int().positive('Total pages must be a positive number'),
});

export type UploadBookInput = z.infer<typeof uploadBookSchema>;

export const storySchema = z.object({
  content: z
    .string()
    .min(1, 'Story content is required')
    .max(5000, 'Story content cannot exceed 5000 characters'),
});

export type StoryInput = z.infer<typeof storySchema>;

export const quoteSchema = z.object({
  text: z
    .string()
    .min(1, 'Quote text is required')
    .max(1000, 'Quote text cannot exceed 1000 characters'),
  author: z.string().max(100, 'Author name cannot exceed 100 characters').optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
