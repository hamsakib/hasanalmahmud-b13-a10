import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { FiPackage, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import StatCard from '../../components/dashboard/StatCard';
import { Spinner } from '../../components/shared/Loader';

const DashboardHome = () => {
  const { user, userRole } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['buyer-stats', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/stats/buyer');
      return res.data;
    },
    enabled: userRole === 'buyer',
  });

  if (userRole === 'admin') return <Navigate to="/dashboard/admin" replace />;
  if (userRole === 'seller') return <Navigate to="/dashboard/seller" replace />;

  return (
    <div>
      <Helmet><title>Dashboard | ReSell Hub</title></Helmet>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.displayName?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Here's a summary of your activity</p>
      </div>

      {isLoading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard icon={<FiPackage />} value={stats.totalOrders ?? 0} label="Total Orders" color="blue" index={0} />
          <StatCard icon={<FiHeart />} value={stats.wishlistCount ?? 0} label="Wishlist Items" color="red" index={1} />
          <StatCard icon={<FiShoppingBag />} value={stats.totalSpent ? `৳${stats.totalSpent.toLocaleString()}` : '৳0'} label="Total Spent" color="green" index={2} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Purchases</h2>
        {(stats.recentPurchases?.length ?? 0) === 0 ? (
          <p className="text-gray-500 text-sm">No recent purchases yet. <a href="/products" className="text-blue-600">Browse products</a></p>
        ) : (
          <div className="space-y-3">
            {stats.recentPurchases.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img src={order.productImage || 'https://via.placeholder.com/50'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{order.productTitle}</p>
                    <p className="text-xs text-gray-500 capitalize">{order.orderStatus}</p>
                  </div>
                </div>
                <span className="font-semibold text-blue-700">৳{order.amount?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
