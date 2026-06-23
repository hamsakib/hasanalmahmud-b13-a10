import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiDollarSign } from 'react-icons/fi';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Spinner } from '../../../components/shared/Loader';
import StatCard from '../../../components/dashboard/StatCard';

const statusStyles = {
  success: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => (await axiosSecure.get('/api/payments')).data,
  });

  const totalRevenue = payments
    .filter((p) => ['success', 'paid'].includes(p.paymentStatus))
    .reduce((s, p) => s + (p.amount || 0), 0);

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      p.buyerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      p.productTitle?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || p.paymentStatus === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <Helmet><title>Transaction Monitoring | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction Monitoring</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard icon={<FiDollarSign />} value={`৳${totalRevenue.toLocaleString()}`} label="Total Revenue" color="green" index={0} />
        <StatCard icon={<FiDollarSign />} value={payments.length} label="Total Transactions" color="blue" index={1} />
        <StatCard icon={<FiDollarSign />} value={payments.filter((p) => ['success', 'paid'].includes(p.paymentStatus)).length} label="Successful" color="purple" index={2} />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by transaction ID, buyer or product..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {isLoading ? <Spinner /> : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">No transactions found.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Transaction ID</th>
                <th className="text-left px-4 py-3 font-medium">Buyer</th>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.transactionId?.slice(0, 22)}…</td>
                  <td className="px-4 py-3 text-gray-600">{p.buyerEmail}</td>
                  <td className="px-4 py-3 text-gray-900">{p.productTitle}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">৳{p.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(p.paymentDate || p.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusStyles[p.paymentStatus] || 'bg-gray-100'}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
