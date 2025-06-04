import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-blue-950 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
            <span className="font-bold text-xl text-white">ReSell Hub</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Bangladesh's trusted marketplace for buying and selling pre-owned products.
            Join thousands of happy users today!
          </p>
          <div className="flex gap-3 mt-4">
            {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'All Products' },
              { to: '/categories', label: 'Categories' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact Us' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-blue-400 transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            {['Electronics', 'Furniture', 'Vehicles', 'Fashion', 'Mobile Phones', 'Books'].map((cat) => (
              <li key={cat}>
                <Link to={`/categories/${cat}`} className="hover:text-blue-400 transition-colors">{cat}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Information</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <FiMapPin className="mt-0.5 text-blue-400 flex-shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-blue-400 flex-shrink-0" />
              <span>+880 1700-000000</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-blue-400 flex-shrink-0" />
              <span>support@resellhub.com</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} ReSell Hub. All rights reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-blue-400">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
