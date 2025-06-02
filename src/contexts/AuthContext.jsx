import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const googleProvider = new GoogleAuthProvider();
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (name, email, password, photoURL = '') => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name, photoURL });
    return result;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleLogin = () => signInWithPopup(auth, googleProvider);

  const logout = async () => {
    localStorage.removeItem('token');
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const { data } = await axios.post(`${API_URL}/api/auth/jwt`, {
            email: currentUser.email,
          });
          localStorage.setItem('token', data.token);
          const roleRes = await axios.get(
            `${API_URL}/api/users/role/${currentUser.email}`,
            { headers: { Authorization: `Bearer ${data.token}` } }
          );
          setUserRole(roleRes.data.role);
        } catch {
          setUserRole('buyer');
        }
      } else {
        localStorage.removeItem('token');
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { user, userRole, loading, register, login, googleLogin, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
