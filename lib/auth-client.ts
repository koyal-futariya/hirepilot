import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from './auth';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
  plugins: [
    inferAdditionalFields<typeof auth>(),
  ],
});

// Export the entire client, including password reset functions
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession, 
  forgetPassword, 
  resetPassword 
} = authClient;
