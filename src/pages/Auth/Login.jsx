import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    setLoading(true);
    try {
      await login(form.email.value, form.password.value);
      toast.success('Logged in successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      // Full-page redirect to Google; Better Auth creates the user (role: buyer)
      // on first sign-in and returns the user to `from`.
      await googleLogin(window.location.origin + from);
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
    }
  };

  const demoLogin = (email, password) => {
    document.querySelector('input[name=email]').value = email;
    document.querySelector('input[name=password]').value = password;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <Helmet><title>Login | ReSell Hub</title></Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Welcome Back</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Login to your ReSell Hub account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input name="email" type="email" required placeholder="Email" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <div className="relative">
            <input name="password" type={showPass ? 'text' : 'password'} required placeholder="Password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          <FcGoogle className="text-xl" /> Continue with Google
        </button>

        <div className="mt-4 text-xs text-center text-gray-400 space-x-2">
          <button onClick={() => demoLogin('admin@resellhub.com', 'Admin123')} className="hover:text-blue-600">Demo Admin</button>
          <span>·</span>
          <button onClick={() => demoLogin('seller@resellhub.com', 'Seller123')} className="hover:text-blue-600">Demo Seller</button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/register" className="text-blue-600 font-medium">Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
