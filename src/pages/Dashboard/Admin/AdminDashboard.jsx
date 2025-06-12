import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign } from 'react-icons/fi';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import StatCard from '../../../components/dashboard/StatCard';
import { Spinner } from '../../../components/shared/Loader';

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await axiosSecure.get('/api/stats/admin')).data,
  });

  return (
    <div>
      <Helmet><title>Admin Dashboard | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {isLoading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={<FiUsers />} value={stats.totalUsers ?? 0} label="Total Users" color="blue" index={0} />
          <StatCard icon={<FiPackage />} value={stats.totalProducts ?? 0} label="Total Products" color="green" index={1} />
          <StatCard icon={<FiShoppingCart />} value={stats.totalOrders ?? 0} label="Total Orders" color="purple" index={2} />
          <StatCard icon={<FiDollarSign />} value={`৳${(stats.totalRevenue ?? 0).toLocaleString()}`} label="Total Revenue" color="amber" index={3} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <a href="/dashboard/manage-users" className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <FiUsers className="text-2xl text-blue-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Manage Users</h3>
          <p className="text-sm text-gray-500 mt-1">View, block, and manage platform users</p>
        </a>
        <a href="/dashboard/admin-products" className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <FiPackage className="text-2xl text-green-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Manage Products</h3>
          <p className="text-sm text-gray-500 mt-1">Approve, reject, and moderate listings</p>
        </a>
        <a href="/dashboard/platform-analytics" className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <FiShoppingCart className="text-2xl text-purple-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Platform Analytics</h3>
          <p className="text-sm text-gray-500 mt-1">View growth and performance insights</p>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
