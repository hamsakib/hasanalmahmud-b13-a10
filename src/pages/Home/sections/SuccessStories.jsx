import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import SectionTitle from '../../../components/shared/SectionTitle';

const stories = [
  {
    name: 'Md. Rakib Hasan',
    role: 'Buyer',
    photo: 'https://i.pravatar.cc/150?img=12',
    text: 'Found a great condition laptop at half the retail price. The seller was verified and the whole transaction felt safe. Highly recommend ReSell Hub!',
    rating: 5,
  },
  {
    name: 'Nusrat Jahan',
    role: 'Seller',
    photo: 'https://i.pravatar.cc/150?img=45',
    text: 'I sold my old furniture within a week of listing. The dashboard makes managing orders super easy and payments are reliable through Stripe.',
    rating: 5,
  },
  {
    name: 'Tanvir Ahmed',
    role: 'Buyer & Seller',
    photo: 'https://i.pravatar.cc/150?img=33',
    text: 'Best marketplace for second-hand goods in Bangladesh. I both buy and sell here regularly. The community is trustworthy and the prices are fair.',
    rating: 5,
  },
];

const SuccessStories = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <SectionTitle title="Success Stories" subtitle="Hear from our happy buyers and sellers" />
    <div className="grid md:grid-cols-3 gap-6">
      {stories.map((story, i) => (
        <motion.div
          key={story.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex gap-1 text-amber-400 mb-4">
            {Array.from({ length: story.rating }).map((_, j) => <FiStar key={j} className="fill-current" />)}
          </div>
          <p className="text-gray-600 italic mb-6">"{story.text}"</p>
          <div className="flex items-center gap-3">
            <img src={story.photo} alt={story.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-gray-900">{story.name}</p>
              <p className="text-sm text-blue-600">{story.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default SuccessStories;
