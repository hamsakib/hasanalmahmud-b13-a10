import { createContext, useContext, useEffect } from 'react';
import { authClient } from '../lib/auth-client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { data: session, isPending } = authClient.useSession();
  const rawUser = session?.user || null;

  // Normalize the Better Auth user to the shape the rest of the app expects
  // (it reads `displayName` / `photoURL`). Google fills the built-in `image`;
  // email/password users fill `photo`.
  const user = rawUser
    ? {
        ...rawUser,
        displayName: rawUser.name,
        photoURL: rawUser.image || rawUser.photo || '',
      }
    : null;

  const userRole = rawUser ? rawUser.role || 'buyer' : null;
  const loading = isPending;

  // Once a Better Auth session exists, fetch a JWT from it and cache it. The
  // secure axios client sends this JWT as a Bearer token; the backend verifies
  // it on private APIs (with the session cookie as a fallback in the meantime).
  useEffect(() => {
    if (!rawUser) {
      localStorage.removeItem('token');
      return;
    }
    let active = true;
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/jwt`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (active && d?.token) localStorage.setItem('token', d.token); })
      .catch(() => {});
    return () => { active = false; };
  }, [rawUser?.id]);

  const register = async (name, email, password, photo = '', role = 'buyer') => {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: photo,
      photo,
      role,
    });
    if (error) throw new Error(error.message || 'Registration failed');
    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message || 'Invalid credentials');
    return data;
  };

  // Google is a full-page redirect: after consent the user returns to `callbackURL`.
  const googleLogin = async (callbackURL = window.location.origin) => {
    const { error } = await authClient.signIn.social({ provider: 'google', callbackURL });
    if (error) throw new Error(error.message || 'Google sign-in failed');
  };

  const logout = async () => {
    localStorage.removeItem('token');
    await authClient.signOut();
  };

  const value = { user, userRole, loading, register, login, googleLogin, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
