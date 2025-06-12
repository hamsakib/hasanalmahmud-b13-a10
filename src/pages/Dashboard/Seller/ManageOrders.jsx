import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Spinner } from '../../../components/shared/Loader';

const STATUS_FLOW = ['pending', 'accepted', 'processing', 'shipped', 'delivered'];

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
};

const ManageOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: async () => (await axiosSecure.get('/api/orders/seller-orders')).data,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, orderStatus }) => axiosSecure.patch(`/api/orders/${id}/status`, { orderStatus }),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
    },
    onError: () => toast.error('Update failed'),
  });

  return (
    <div>
      <Helmet><title>Manage Orders | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Orders</h1>

      {isLoading ? <Spinner /> : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">No incoming orders yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Buyer</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{o.productTitle}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{o.buyerInfo?.name}</p>
                    <p className="text-xs text-gray-500">{o.buyerInfo?.email}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-700">৳{o.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusStyles[o.orderStatus] || 'bg-gray-100'}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {o.orderStatus === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => statusMutation.mutate({ id: o._id, orderStatus: 'accepted' })} className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">Accept</button>
                        <button onClick={() => statusMutation.mutate({ id: o._id, orderStatus: 'rejected' })} className="text-xs bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700">Reject</button>
                      </div>
                    ) : ['cancelled', 'rejected', 'delivered'].includes(o.orderStatus) ? (
                      <span className="text-xs text-gray-400">No action</span>
                    ) : (
                      <select
                        value={o.orderStatus}
                        onChange={(e) => statusMutation.mutate({ id: o._id, orderStatus: e.target.value })}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 capitalize focus:outline-none"
                      >
                        {STATUS_FLOW.slice(STATUS_FLOW.indexOf(o.orderStatus)).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
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

export default ManageOrders;
