import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';

const Hero = () => (
  <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white overflow-hidden">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 0)', backgroundSize: '40px 40px' }} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-blue-500/30 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            ♻️ Sustainable Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Buy & Sell <span className="text-amber-400">Pre-Owned</span> Products Safely
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-lg">
            Give your unused items a second life. Find amazing deals on quality second-hand
            products while helping reduce waste and promote sustainable consumption.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/products" className="inline-flex items-center gap-2 bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors">
              <FiShoppingBag /> Browse Products
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Start Selling <FiArrowRight />
            </Link>
          </div>
          <div className="flex gap-8 mt-12">
            {[
              { value: '10K+', label: 'Active Listings' },
              { value: '5K+', label: 'Happy Users' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-amber-400">{stat.value}</p>
                <p className="text-sm text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block"
        >
          <img
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80"
            alt="Marketplace"
            className="rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
