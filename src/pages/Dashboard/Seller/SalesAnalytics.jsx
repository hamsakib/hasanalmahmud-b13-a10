import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const COLORS = ['#2563eb', '#f97316', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

// Fallback demo data (per spec: fake data allowed for charts)
const demoMonthly = [
  { month: 'Jan', sales: 12, revenue: 45000 },
  { month: 'Feb', sales: 19, revenue: 68000 },
  { month: 'Mar', sales: 15, revenue: 52000 },
  { month: 'Apr', sales: 25, revenue: 89000 },
  { month: 'May', sales: 22, revenue: 76000 },
  { month: 'Jun', sales: 30, revenue: 110000 },
];
const demoTopProducts = [
  { name: 'Laptops', value: 35 },
  { name: 'Phones', value: 28 },
  { name: 'Furniture', value: 18 },
  { name: 'Fashion', value: 12 },
  { name: 'Books', value: 7 },
];

const SalesAnalytics = () => {
  const axiosSecure = useAxiosSecure();
  const { data } = useQuery({
    queryKey: ['seller-analytics'],
    queryFn: async () => {
      try { return (await axiosSecure.get('/api/stats/seller-analytics')).data; }
      catch { return {}; }
    },
  });

  const monthly = data?.monthly?.length ? data.monthly : demoMonthly;
  const topProducts = data?.topProducts?.length ? data.topProducts : demoTopProducts;

  return (
    <div>
      <Helmet><title>Sales Analytics | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sales Analytics</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={topProducts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {topProducts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
