import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Spinner } from '../../../components/shared/Loader';

const BuyerWishlist = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await axiosSecure.get('/api/wishlist')).data,
  });

  const removeMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/wishlist/${id}`),
    onSuccess: () => {
      toast.success('Removed from wishlist');
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return (
    <div>
      <Helmet><title>Wishlist | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

      {isLoading ? <Spinner /> : wishlist.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">
          Your wishlist is empty. <Link to="/products" className="text-blue-600">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <img src={item.image || 'https://via.placeholder.com/300'} alt={item.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{item.title}</h3>
                <p className="text-lg font-bold text-blue-700 mb-3">৳{item.price?.toLocaleString()}</p>
                <div className="flex gap-2">
                  <Link to={`/products/${item.productId}`} className="flex-1 inline-flex items-center justify-center gap-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700">
                    <FiExternalLink /> View
                  </Link>
                  <button onClick={() => removeMutation.mutate(item._id)} className="px-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerWishlist;
