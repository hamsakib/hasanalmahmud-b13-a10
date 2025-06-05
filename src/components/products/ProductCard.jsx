import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiMapPin, FiCheckCircle } from 'react-icons/fi';

const conditionColors = {
  'New': 'bg-green-100 text-green-700',
  'Like New': 'bg-emerald-100 text-emerald-700',
  'Good': 'bg-blue-100 text-blue-700',
  'Used': 'bg-amber-100 text-amber-700',
  'Refurbished': 'bg-purple-100 text-purple-700',
};

const ProductCard = ({ product, onWishlist }) => {
  const {
    _id, title, price, images, category, condition,
    sellerInfo, status, location,
  } = product;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Link to={`/products/${_id}`}>
          <img
            src={images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <span className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full ${conditionColors[condition] || 'bg-gray-100 text-gray-700'}`}>
          {condition}
        </span>
        {onWishlist && (
          <button
            onClick={() => onWishlist(product)}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
          >
            <FiHeart className="text-sm" />
          </button>
        )}
        {status !== 'available' && (
          <span className="absolute bottom-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-red-500 text-white capitalize">
            {status}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-blue-600 font-medium mb-1">{category}</p>
        <Link to={`/products/${_id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors min-h-[3rem]">{title}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
          <FiMapPin className="flex-shrink-0" />
          <span className="truncate">{location || sellerInfo?.location || 'Bangladesh'}</span>
        </div>
        {sellerInfo?.verified && (
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <FiCheckCircle /> Verified Seller
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-lg font-bold text-blue-700">৳{price?.toLocaleString()}</span>
          <Link
            to={`/products/${_id}`}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
