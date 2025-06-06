import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPackage, FiUsers, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

const MarketplaceStats = () => {
  const axiosPublic = useAxiosPublic();
  const { data: stats = {} } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      const res = await axiosPublic.get('/api/stats/marketplace');
      return res.data;
    },
  });

  const cards = [
    { icon: <FiPackage />, value: stats.totalProducts ?? 0, label: 'Total Products', color: 'text-blue-600 bg-blue-100' },
    { icon: <FiUsers />, value: stats.totalSellers ?? 0, label: 'Total Sellers', color: 'text-green-600 bg-green-100' },
    { icon: <FiUsers />, value: stats.totalBuyers ?? 0, label: 'Total Buyers', color: 'text-purple-600 bg-purple-100' },
    { icon: <FiCheckCircle />, value: stats.completedOrders ?? 0, label: 'Completed Orders', color: 'text-amber-600 bg-amber-100' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-5 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MarketplaceStats;
