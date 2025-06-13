import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useAuth } from '../../contexts/AuthContext';

const CheckoutForm = ({ order, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order?.amount > 0) {
      axiosSecure.post('/api/payments/create-payment-intent', { amount: order.amount })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch(() => setError('Failed to initialize payment'));
    }
  }, [order, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setProcessing(true);
    setError('');

    const card = elements.getElement(CardElement);
    const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });
    if (methodError) {
      setError(methodError.message);
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await axiosSecure.post('/api/payments', {
          orderId: order._id,
          transactionId: paymentIntent.id,
          amount: order.amount,
          paymentMethod: 'card',
          buyerEmail: user.email,
        });
        toast.success('Payment successful!');
        onSuccess(paymentIntent.id);
      } catch {
        toast.error('Payment recorded but failed to save. Contact support.');
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <CardElement options={{
          style: { base: { fontSize: '16px', color: '#374151', '::placeholder': { color: '#9ca3af' } } },
        }} />
      </div>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        <FiLock /> {processing ? 'Processing...' : `Pay ৳${order.amount?.toLocaleString()}`}
      </button>
      <p className="text-xs text-gray-400 text-center mt-3">
        🔒 Secured by Stripe. Use test card 4242 4242 4242 4242.
      </p>
    </form>
  );
};

export default CheckoutForm;
