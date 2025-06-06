import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import SectionTitle from '../../../components/shared/SectionTitle';
import ProductCard from '../../../components/products/ProductCard';
import { SkeletonGrid } from '../../../components/shared/Loader';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

const FeaturedProducts = () => {
  const axiosPublic = useAxiosPublic();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await axiosPublic.get('/api/products/featured');
      return res.data;
    },
  });

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Featured Products" subtitle="Check out the latest products listed on our marketplace" />
        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            View All Products <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
