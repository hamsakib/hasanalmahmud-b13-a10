import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiMapPin, FiCheckCircle, FiStar, FiFlag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FullPageLoader } from '../../components/shared/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [activeImg, setActiveImg] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/products/${id}`);
      return res.data;
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/reviews/product/${id}`);
      return res.data;
    },
  });

  // Track recently viewed (optional feature)
  useEffect(() => {
    if (product?._id) {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const filtered = viewed.filter((p) => p._id !== product._id);
      filtered.unshift({ _id: product._id, title: product.title, images: product.images, price: product.price });
      localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 6)));
    }
  }, [product]);

  const wishlistMutation = useMutation({
    mutationFn: () => axiosSecure.post('/api/wishlist', {
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0],
    }),
    onSuccess: () => toast.success('Added to wishlist!'),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add'),
  });

  const orderMutation = useMutation({
    mutationFn: () => axiosSecure.post('/api/orders', { productId: product._id, quantity: 1 }),
    onSuccess: (res) => {
      toast.success('Order created! Proceed to payment.');
      navigate(`/checkout/${res.data.orderId}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Order failed'),
  });

  const reportMutation = useMutation({
    mutationFn: (reason) => axiosSecure.post('/api/reports', { productId: product._id, reason }),
    onSuccess: () => toast.success('Product reported. Admin will review it.'),
    onError: () => toast.error('Failed to report'),
  });

  if (isLoading) return <FullPageLoader />;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  const requireAuth = (action) => {
    if (!user) { navigate('/login'); return; }
    action();
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet><title>{product.title} | ReSell Hub</title></Helmet>

      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link> /{' '}
        <Link to="/products" className="hover:text-blue-600">Products</Link> /{' '}
        <span className="text-gray-700">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl overflow-hidden border border-gray-100 mb-4">
            <img
              src={product.images?.[activeImg] || 'https://via.placeholder.com/600x400'}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </motion.div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImg === i ? 'border-blue-600' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{product.category}</span>
            <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{product.condition}</span>
            {product.status !== 'available' && (
              <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full capitalize">{product.status}</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
          {avgRating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} className={i < Math.round(avgRating) ? 'fill-current' : ''} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{avgRating} ({reviews.length} reviews)</span>
            </div>
          )}
          <p className="text-4xl font-bold text-blue-700 mb-4">৳{product.price?.toLocaleString()}</p>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <FiMapPin /> {product.location || product.sellerInfo?.location || 'Bangladesh'}
            {product.stock !== undefined && <span className="ml-4">Stock: {product.stock}</span>}
          </div>

          {/* Seller card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
            <img
              src={product.sellerInfo?.photo || `https://ui-avatars.com/api/?name=${product.sellerInfo?.name}&background=2563eb&color=fff`}
              alt="seller"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="font-semibold text-gray-900">{product.sellerInfo?.name}</p>
                {product.sellerInfo?.verified && <FiCheckCircle className="text-green-500" />}
              </div>
              <p className="text-sm text-gray-500">Seller</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => requireAuth(() => orderMutation.mutate())}
              disabled={product.status !== 'available' || orderMutation.isPending}
              className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FiShoppingCart /> Buy Now
            </button>
            <button
              onClick={() => requireAuth(() => wishlistMutation.mutate())}
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <FiHeart /> Wishlist
            </button>
            <button
              onClick={() => requireAuth(() => {
                const reason = prompt('Why are you reporting this product?');
                if (reason) reportMutation.mutate(reason);
              })}
              className="inline-flex items-center justify-center gap-2 border border-red-200 text-red-600 font-medium px-4 py-3 rounded-xl hover:bg-red-50 transition-colors"
            >
              <FiFlag />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">{review.reviewerInfo?.name}</p>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className={i < review.rating ? 'fill-current' : ''} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
