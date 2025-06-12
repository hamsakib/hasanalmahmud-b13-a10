import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { FiPackage, FiTrendingUp, FiDollarSign, FiClock } from 'react-icons/fi';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import StatCard from '../../../components/dashboard/StatCard';
import { Spinner } from '../../../components/shared/Loader';

const SellerDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['seller-stats'],
    queryFn: async () => (await axiosSecure.get('/api/stats/seller')).data,
  });

  return (
    <div>
      <Helmet><title>Seller Dashboard | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Seller Dashboard</h1>

      {isLoading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={<FiPackage />} value={stats.totalProducts ?? 0} label="Total Products" color="blue" index={0} />
          <StatCard icon={<FiTrendingUp />} value={stats.totalSales ?? 0} label="Total Sales" color="green" index={1} />
          <StatCard icon={<FiDollarSign />} value={`৳${(stats.totalRevenue ?? 0).toLocaleString()}`} label="Total Revenue" color="purple" index={2} />
          <StatCard icon={<FiClock />} value={stats.pendingOrders ?? 0} label="Pending Orders" color="amber" index={3} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {(stats.recentOrders?.length ?? 0) === 0 ? (
            <p className="text-gray-500 text-sm">No recent orders.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((o) => (
                <div key={o._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{o.productTitle}</span>
                  <span className="text-sm capitalize text-blue-600">{o.orderStatus}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/dashboard/add-product" className="block p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium">+ Add New Product</a>
            <a href="/dashboard/my-products" className="block p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium">Manage My Products</a>
            <a href="/dashboard/manage-orders" className="block p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium">View Orders</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
