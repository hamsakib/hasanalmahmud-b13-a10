import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../Home/sections/PopularCategories';

const Categories = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <Helmet><title>Categories | ReSell Hub</title></Helmet>
    <div className="text-center mb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Browse Categories</h1>
      <p className="text-gray-500 mt-3">Find exactly what you're looking for</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {CATEGORIES.map((cat, i) => (
        <motion.div
          key={cat.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Link
            to={`/categories/${cat.name}`}
            className={`block bg-gradient-to-br ${cat.color} rounded-2xl p-10 text-center text-white hover:scale-105 transition-transform shadow-lg`}
          >
            <div className="text-6xl mb-4">{cat.icon}</div>
            <p className="font-semibold text-lg">{cat.name}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Categories;
