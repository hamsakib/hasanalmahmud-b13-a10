import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionTitle from '../../../components/shared/SectionTitle';

export const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: 'from-blue-500 to-blue-600' },
  { name: 'Furniture', icon: '🛋️', color: 'from-amber-500 to-orange-600' },
  { name: 'Vehicles', icon: '🚗', color: 'from-red-500 to-rose-600' },
  { name: 'Fashion', icon: '👕', color: 'from-pink-500 to-fuchsia-600' },
  { name: 'Mobile Phones', icon: '📱', color: 'from-green-500 to-emerald-600' },
  { name: 'Books', icon: '📚', color: 'from-purple-500 to-violet-600' },
];

const PopularCategories = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <SectionTitle title="Popular Categories" subtitle="Explore products across our most popular categories" />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {CATEGORIES.map((cat, i) => (
        <motion.div
          key={cat.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Link
            to={`/categories/${cat.name}`}
            className={`block bg-gradient-to-br ${cat.color} rounded-xl p-6 text-center text-white hover:scale-105 transition-transform shadow-md`}
          >
            <div className="text-4xl mb-3">{cat.icon}</div>
            <p className="font-medium text-sm">{cat.name}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default PopularCategories;
