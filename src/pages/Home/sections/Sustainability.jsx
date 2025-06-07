import { motion } from 'framer-motion';
import { FiTrendingDown, FiRefreshCw, FiDroplet } from 'react-icons/fi';

const impacts = [
  { icon: <FiTrendingDown />, value: '2.5M kg', label: 'CO₂ Emissions Saved', desc: 'By reusing instead of buying new' },
  { icon: <FiRefreshCw />, value: '50K+', label: 'Items Given Second Life', desc: 'Reducing landfill waste significantly' },
  { icon: <FiDroplet />, value: '1.2M L', label: 'Water Saved', desc: 'From avoided manufacturing' },
];

const Sustainability = () => (
  <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="inline-block bg-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-4">🌍 Sustainability Impact</span>
        <h2 className="text-3xl md:text-4xl font-bold">Buying Second-Hand Helps the Planet</h2>
        <p className="text-green-100 mt-3 max-w-2xl mx-auto">
          Every pre-owned purchase reduces waste and conserves resources. Together, our community is making a real difference.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {impacts.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur rounded-xl p-6 text-center"
          >
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              {item.icon}
            </div>
            <p className="text-3xl font-bold">{item.value}</p>
            <p className="font-medium mt-1">{item.label}</p>
            <p className="text-green-100 text-sm mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Sustainability;
