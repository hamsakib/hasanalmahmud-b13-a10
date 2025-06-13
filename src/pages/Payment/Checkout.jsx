import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FullPageLoader } from '../../components/shared/Loader';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => (await axiosSecure.get(`/api/orders/${orderId}`)).data,
  });

  if (isLoading) return <FullPageLoader />;
  if (!order) return <div className="text-center py-20">Order not found.</div>;
  if (order.paymentStatus === 'paid') {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="text-gray-600 mb-4">This order is already paid.</p>
        <Link to="/dashboard/my-orders" className="text-blue-600">View My Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet><title>Checkout | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="flex gap-4 mb-4">
            <img src={order.productImage || 'https://via.placeholder.com/80'} alt="" className="w-20 h-20 rounded-lg object-cover" />
            <div>
              <p className="font-medium text-gray-900">{order.productTitle}</p>
              <p className="text-sm text-gray-500">Quantity: {order.quantity || 1}</p>
              <p className="text-sm text-gray-500">Seller: {order.sellerInfo?.name}</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Product Price</span><span>৳{order.amount?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span>{order.quantity || 1}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="text-green-600">Free</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
              <span>Total Amount</span><span className="text-blue-700">৳{order.amount?.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm">
            <p className="font-medium text-gray-700 mb-1">Delivery Information</p>
            <p className="text-gray-500">{order.buyerInfo?.name}</p>
            <p className="text-gray-500">{order.buyerInfo?.email}</p>
          </div>
        </div>

        {/* Payment form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Payment Details</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm order={order} onSuccess={(txn) => navigate(`/payment-success?txn=${txn}&order=${orderId}`)} />
          </Elements>
          <button onClick={() => navigate('/dashboard/my-orders')} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700">
            Cancel Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
