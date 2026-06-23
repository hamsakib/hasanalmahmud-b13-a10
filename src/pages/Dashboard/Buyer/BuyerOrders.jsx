import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiX } from 'react-icons/fi';
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
  const [details, setDetails] = useState(null);

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
                    <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                      <button onClick={() => setDetails(order)} className="text-gray-600 hover:underline">Details</button>
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

      {/* Order details modal */}
      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetails(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
              <button onClick={() => setDetails(null)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
            </div>
            <div className="flex gap-3 mb-4">
              <img src={details.productImage || 'https://via.placeholder.com/64'} alt="" className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium text-gray-900">{details.productTitle}</p>
                <p className="text-sm text-gray-500">Seller: {details.sellerInfo?.name}</p>
              </div>
            </div>
            <div className="text-sm space-y-2 border-t border-gray-100 pt-3">
              <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-mono text-xs">{details._id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span>{details.quantity || 1}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-semibold text-blue-700">৳{details.amount?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="capitalize">{details.paymentStatus}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Order Status</span><span className="capitalize">{details.orderStatus}</span></div>
              {details.transactionId && <div className="flex justify-between"><span className="text-gray-500">Transaction</span><span className="font-mono text-xs">{details.transactionId.slice(0, 18)}…</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{new Date(details.createdAt).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
