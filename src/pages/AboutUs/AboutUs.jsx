import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiHeart } from 'react-icons/fi';
import SectionTitle from '../../components/shared/SectionTitle';

const AboutUs = () => (
  <div>
    <Helmet><title>About Us | ReSell Hub</title></Helmet>
    <section className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About ReSell Hub</h1>
        <p className="text-blue-100 text-lg">
          We're on a mission to build Bangladesh's most trusted marketplace for pre-owned products,
          making sustainable shopping accessible to everyone.
        </p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: <FiTarget />, title: 'Our Mission', text: 'To reduce waste and promote sustainable consumption by giving pre-owned products a second life.' },
          { icon: <FiEye />, title: 'Our Vision', text: 'A circular economy where every usable item finds a new owner instead of ending up in landfills.' },
          { icon: <FiHeart />, title: 'Our Values', text: 'Trust, transparency, and community. We prioritize safe transactions and verified sellers.' },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">{item.icon}</div>
            <h3 className="font-semibold text-xl text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Why Choose Us?" subtitle="The benefits of buying and selling on ReSell Hub" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Reduce Waste', desc: 'Keep usable products out of landfills' },
            { title: 'Save Money', desc: 'Find quality items at affordable prices' },
            { title: 'Earn Income', desc: 'Make money from items you no longer need' },
            { title: 'Safe & Secure', desc: 'Verified sellers and secure Stripe payments' },
          ].map((b) => (
            <div key={b.title} className="bg-white rounded-xl p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">{b.title}</h4>
              <p className="text-sm text-gray-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AboutUs;
