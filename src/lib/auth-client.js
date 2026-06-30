import { createAuthClient } from 'better-auth/react';

// The Better Auth client talks to the Express server's /api/auth/* routes.
// `credentials: 'include'` sends the session cookie on every request.
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { signIn, signUp, signOut, useSession, getSession, updateUser } = authClient;
