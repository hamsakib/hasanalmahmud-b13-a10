import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Spinner } from '../../../components/shared/Loader';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const BuyerOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => (await axiosSecure.get('/api/orders/my-orders')).data,
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/api/orders/${id}/cancel`),
    onSuccess: () => {
      toast.success('Order cancelled');
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Cannot cancel'),
  });

  return (
    <div>
      <Helmet><title>My Orders | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {isLoading ? <Spinner /> : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">
          No orders yet. <Link to="/products" className="text-blue-600">Start shopping</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Payment</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={order.productImage || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-gray-900">{order.productTitle}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-700">৳{order.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusStyles[order.orderStatus] || 'bg-gray-100'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {order.paymentStatus !== 'paid' && (
                        <Link to={`/checkout/${order._id}`} className="text-blue-600 hover:underline">Pay</Link>
                      )}
                      {['pending', 'accepted'].includes(order.orderStatus) && (
                        <button onClick={() => cancelMutation.mutate(order._id)} className="text-red-600 hover:underline">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
