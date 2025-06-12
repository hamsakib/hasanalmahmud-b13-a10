import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const COLORS = ['#2563eb', '#f97316', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

const demoUserGrowth = [
  { month: 'Jan', users: 120 }, { month: 'Feb', users: 210 }, { month: 'Mar', users: 350 },
  { month: 'Apr', users: 480 }, { month: 'May', users: 690 }, { month: 'Jun', users: 920 },
];
const demoCategoryPerf = [
  { category: 'Electronics', sales: 320 }, { category: 'Furniture', sales: 180 },
  { category: 'Vehicles', sales: 90 }, { category: 'Fashion', sales: 240 },
  { category: 'Mobiles', sales: 410 }, { category: 'Books', sales: 70 },
];
const demoMonthlyOrders = [
  { month: 'Jan', orders: 45 }, { month: 'Feb', orders: 68 }, { month: 'Mar', orders: 92 },
  { month: 'Apr', orders: 110 }, { month: 'May', orders: 134 }, { month: 'Jun', orders: 178 },
];
const demoTopCategories = [
  { name: 'Mobiles', value: 410 }, { name: 'Electronics', value: 320 },
  { name: 'Fashion', value: 240 }, { name: 'Furniture', value: 180 }, { name: 'Vehicles', value: 90 },
];

const PlatformAnalytics = () => {
  const axiosSecure = useAxiosSecure();
  const { data } = useQuery({
    queryKey: ['platform-analytics'],
    queryFn: async () => {
      try { return (await axiosSecure.get('/api/stats/platform-analytics')).data; }
      catch { return {}; }
    },
  });

  const userGrowth = data?.userGrowth?.length ? data.userGrowth : demoUserGrowth;
  const categoryPerf = data?.categoryPerformance?.length ? data.categoryPerformance : demoCategoryPerf;
  const monthlyOrders = data?.monthlyOrders?.length ? data.monthlyOrders : demoMonthlyOrders;
  const topCategories = data?.topCategories?.length ? data.topCategories : demoTopCategories;

  return (
    <div>
      <Helmet><title>Platform Analytics | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Analytics</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
              <Area type="monotone" dataKey="users" stroke="#2563eb" fill="#bfdbfe" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Category Performance</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryPerf}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" fontSize={11} /><YAxis fontSize={12} /><Tooltip />
              <Bar dataKey="sales" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Orders</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top Categories</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={topCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {topCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
