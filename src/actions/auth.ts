'use server';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export type ActionState = {
  success: boolean;
  message: string;
  url?: string;
  errors?: Record<string, string[]>;
};

export const googleSignInAction = async (): Promise<ActionState> => {
  try {
    const headersList = await headers();
    
    const result = await auth.api.signInSocial({
      body: {
        provider: 'google',
        callbackURL: '/read',
        errorCallbackURL: '/auth?error=failed',
      },
      headers: headersList,
    });

    // If the result contains a URL, return it for client-side redirect
    if (result && typeof result === 'object' && 'url' in result) {
      return {
        success: true,
        message: 'Redirecting to Google...',
        url: result.url as string,
      };
    }

    return {
      success: true,
      message: 'Authentication initiated',
    };
  } catch (error) {
    console.error('Google signin error:', error);
    return {
      success: false,
      message: 'An error occurred during Google sign in. Please try again.',
    };
  }
};

export const signoutAction = async (): Promise<void> => {
  try {
    const headersList = await headers();
    
    await auth.api.signOut({
      headers: headersList,
    });
  } catch (error) {
    console.error('Signout error:', error);
    // Even if there's an error, we still redirect to login
  }

  // Redirect to auth page after signout
  redirect('/auth');
};
