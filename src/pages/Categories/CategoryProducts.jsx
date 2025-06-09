import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../../components/products/ProductCard';
import { SkeletonGrid } from '../../components/shared/Loader';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const CategoryProducts = () => {
  const { category } = useParams();
  const axiosPublic = useAxiosPublic();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['category-products', category],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/products?category=${category}&limit=100`);
      return res.data.products || [];
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet><title>{category} | ReSell Hub</title></Helmet>
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link> /{' '}
        <Link to="/categories" className="hover:text-blue-600">Categories</Link> /{' '}
        <span className="text-gray-700">{category}</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{category}</h1>
      {isLoading ? (
        <SkeletonGrid count={8} />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">No products in this category yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
