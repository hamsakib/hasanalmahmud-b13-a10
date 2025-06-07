import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiStar } from 'react-icons/fi';
import SectionTitle from '../../../components/shared/SectionTitle';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

const TrustedSellers = () => {
  const axiosPublic = useAxiosPublic();
  const { data: sellers = [] } = useQuery({
    queryKey: ['trusted-sellers'],
    queryFn: async () => {
      const res = await axiosPublic.get('/api/users/trusted-sellers');
      return res.data;
    },
  });

  const fallback = [
    { name: 'Nusrat Jahan', photo: 'https://i.pravatar.cc/150?img=45', rating: 4.9, sales: 142 },
    { name: 'Karim Electronics', photo: 'https://i.pravatar.cc/150?img=15', rating: 4.8, sales: 98 },
    { name: 'Fashion Hub BD', photo: 'https://i.pravatar.cc/150?img=20', rating: 4.7, sales: 76 },
    { name: 'Tech Bazaar', photo: 'https://i.pravatar.cc/150?img=8', rating: 4.9, sales: 203 },
  ];

  const list = sellers.length ? sellers : fallback;

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Trusted Sellers" subtitle="Shop with confidence from our top-rated verified sellers" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((seller, i) => (
            <motion.div
              key={seller._id || seller.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center"
            >
              <div className="relative inline-block">
                <img
                  src={seller.photo || `https://ui-avatars.com/api/?name=${seller.name}&background=2563eb&color=fff`}
                  alt={seller.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto"
                />
                <FiCheckCircle className="absolute bottom-0 right-0 text-green-500 bg-white rounded-full text-xl" />
              </div>
              <p className="font-semibold text-gray-900 mt-3">{seller.name}</p>
              <div className="flex items-center justify-center gap-1 text-amber-400 text-sm mt-1">
                <FiStar className="fill-current" /> {seller.rating || 4.8}
              </div>
              <p className="text-xs text-gray-500 mt-1">{seller.sales || seller.totalSales || 0} sales</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedSellers;
