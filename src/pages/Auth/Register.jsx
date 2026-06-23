import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const Register = () => {
  const { register, googleLogin } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveUser = async (userData) => {
    try { await axiosPublic.post('/api/users', userData); } catch { /* user may exist */ }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photo = form.photo.value;
    const password = form.password.value;
    const role = form.role.value;

    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!/[A-Z]/.test(password)) return toast.error('Password must contain an uppercase letter');
    if (!/[a-z]/.test(password)) return toast.error('Password must contain a lowercase letter');

    setLoading(true);
    try {
      await register(name, email, password, photo);
      await saveUser({ name, email, photo, role: role === 'seller' ? 'seller' : 'buyer', status: 'active' });
      toast.success('Registration successful!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await googleLogin();
      await saveUser({
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        role: 'buyer',
        status: 'active',
      });
      toast.success('Signed in with Google!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <Helmet><title>Register | ReSell Hub</title></Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Create an Account</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Join ReSell Hub today</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input name="name" required placeholder="Full Name" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <input name="email" type="email" required placeholder="Email" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <input name="photo" placeholder="Photo URL (optional)" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">I want to register as</label>
            <select name="role" defaultValue="buyer" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="buyer">Buyer — browse and purchase products</option>
              <option value="seller">Seller — list and sell products</option>
            </select>
          </div>
          <div className="relative">
            <input name="password" type={showPass ? 'text' : 'password'} required placeholder="Password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Register'}
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

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
