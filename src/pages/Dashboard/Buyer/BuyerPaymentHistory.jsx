import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Spinner } from '../../../components/shared/Loader';

const statusStyles = {
  success: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const BuyerPaymentHistory = () => {
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payment-history'],
    queryFn: async () => (await axiosSecure.get('/api/payments/my-payments')).data,
  });

  return (
    <div>
      <Helmet><title>Payment History | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h1>

      {isLoading ? <Spinner /> : payments.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">No payment records yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Transaction ID</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Method</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.transactionId}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">৳{p.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 capitalize">{p.paymentMethod || 'card'}</td>
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

export default BuyerPaymentHistory;
