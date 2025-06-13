import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const txn = params.get('txn');
  const orderId = params.get('order');
  const axiosSecure = useAxiosSecure();

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => (await axiosSecure.get(`/api/orders/${orderId}`)).data,
    enabled: !!orderId,
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <Helmet><title>Payment Success | ReSell Hub</title></Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-4"
        >
          <FiCheckCircle />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-6">Thank you for your purchase. Your order is confirmed.</p>

        <div className="bg-gray-50 rounded-xl p-5 text-left text-sm space-y-2 mb-6">
          {order && (
            <>
              <div className="flex justify-between"><span className="text-gray-500">Product</span><span className="font-medium">{order.productTitle}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium text-blue-700">৳{order.amount?.toLocaleString()}</span></div>
            </>
          )}
          <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="font-mono text-xs">{txn?.slice(0, 24)}...</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{new Date().toLocaleDateString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-green-600 font-medium">Paid</span></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/dashboard/my-orders" className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700">Go to My Orders</Link>
          <Link to="/products" className="flex-1 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50">Continue Shopping</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
