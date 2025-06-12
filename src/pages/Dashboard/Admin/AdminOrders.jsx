import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Spinner } from '../../../components/shared/Loader';

const STATUSES = ['pending', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => (await axiosSecure.get('/api/orders/all')).data,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, orderStatus }) => axiosSecure.patch(`/api/orders/${id}/status`, { orderStatus }),
    onSuccess: () => { toast.success('Order updated'); queryClient.invalidateQueries({ queryKey: ['admin-orders'] }); },
  });

  return (
    <div>
      <Helmet><title>Manage Orders | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Orders</h1>

      {isLoading ? <Spinner /> : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">No orders on the platform yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Buyer</th>
                <th className="text-left px-4 py-3 font-medium">Seller</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Payment</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{o.productTitle}</td>
                  <td className="px-4 py-3 text-gray-600">{o.buyerInfo?.name}</td>
                  <td className="px-4 py-3 text-gray-600">{o.sellerInfo?.name}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">৳{o.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => statusMutation.mutate({ id: o._id, orderStatus: e.target.value })}
                      className={`text-xs rounded-lg px-2 py-1 capitalize border-0 focus:outline-none ${statusStyles[o.orderStatus] || 'bg-gray-100'}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
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

export default AdminOrders;
