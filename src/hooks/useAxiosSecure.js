import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Private API client. Sends the JWT (issued from the Better Auth session) as a
// Bearer token, and also sends the session cookie (withCredentials) as a fallback
// for the brief window before the JWT has been fetched.
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        await logout();
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
