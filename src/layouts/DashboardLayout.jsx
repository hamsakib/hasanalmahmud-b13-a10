import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FiHome, FiPackage, FiHeart, FiCreditCard, FiUser,
  FiPlusSquare, FiList, FiTruck, FiBarChart2,
  FiUsers, FiShield, FiSettings, FiLogOut, FiMenu, FiX,
} from 'react-icons/fi';

const buyerLinks = [
  { to: '/dashboard', label: 'Overview', icon: <FiHome /> },
  { to: '/dashboard/my-orders', label: 'My Orders', icon: <FiPackage /> },
  { to: '/dashboard/wishlist', label: 'Wishlist', icon: <FiHeart /> },
  { to: '/dashboard/payment-history', label: 'Payment History', icon: <FiCreditCard /> },
  { to: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
];

const sellerLinks = [
  { to: '/dashboard/seller', label: 'Overview', icon: <FiHome /> },
  { to: '/dashboard/add-product', label: 'Add Product', icon: <FiPlusSquare /> },
  { to: '/dashboard/my-products', label: 'My Products', icon: <FiList /> },
  { to: '/dashboard/manage-orders', label: 'Manage Orders', icon: <FiTruck /> },
  { to: '/dashboard/sales-analytics', label: 'Sales Analytics', icon: <FiBarChart2 /> },
  { to: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
];

const adminLinks = [
  { to: '/dashboard/admin', label: 'Overview', icon: <FiShield /> },
  { to: '/dashboard/manage-users', label: 'Manage Users', icon: <FiUsers /> },
  { to: '/dashboard/admin-products', label: 'Manage Products', icon: <FiList /> },
  { to: '/dashboard/admin-orders', label: 'Manage Orders', icon: <FiTruck /> },
  { to: '/dashboard/platform-analytics', label: 'Analytics', icon: <FiBarChart2 /> },
];

const DashboardLayout = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links =
    userRole === 'admin' ? adminLinks :
    userRole === 'seller' ? sellerLinks :
    buyerLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-blue-900 text-white">
      <div className="p-6 border-b border-blue-800">
        <NavLink to="/" className="text-xl font-bold text-white">
          🔄 ReSell Hub
        </NavLink>
        <p className="text-blue-300 text-xs mt-1 capitalize">{userRole} Dashboard</p>
      </div>
      <div className="p-4 border-b border-blue-800 flex items-center gap-3">
        <img
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=2563eb&color=fff`}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-sm">{user?.displayName || 'User'}</p>
          <p className="text-blue-300 text-xs truncate max-w-[140px]">{user?.email}</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/dashboard/seller' || link.to === '/dashboard/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-blue-800 space-y-1">
        <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-blue-200 hover:bg-blue-800 hover:text-white transition-colors">
          <FiSettings /> Settings
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-blue-200 hover:bg-red-600 hover:text-white transition-colors"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <FiMenu className="text-xl" />
          </button>
          <span className="font-bold text-blue-900">ReSell Hub</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
