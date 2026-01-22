'use server';

import { auth } from '@/lib/auth';

import { signupSchema, loginSchema } from '@/types/validation';

import { APIError } from 'better-auth/api';
import { redirect } from 'next/navigation';

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const signupAction = async (
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = signupSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed. Please check the form for errors.',
      errors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const { email, password, username } = validatedFields.data;

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
      },
    });

    return {
      success: true,
      message: 'Account created successfully! You can now sign in.',
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message || 'An error occurred during signup.',
      };
    }

    console.error('Signup error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
};

export const signinAction = async (
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = loginSchema.safeParse({
    ...rawData,
    rememberMe: rawData.rememberMe === 'on',
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed. Please check the form for errors.',
      errors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const { email, password, rememberMe } = validatedFields.data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe,
      },
    });

    return {
      success: true,
      message: 'Logged in successfully!',
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message || 'Invalid email or password.',
      };
    }

    console.error('Signin error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
};

export const signoutAction = async () => {};
