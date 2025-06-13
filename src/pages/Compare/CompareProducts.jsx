import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiX, FiPlus } from 'react-icons/fi';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const CompareProducts = () => {
  const axiosPublic = useAxiosPublic();
  const [selected, setSelected] = useState([]);
  const [picker, setPicker] = useState(false);

  const { data } = useQuery({
    queryKey: ['compare-products'],
    queryFn: async () => (await axiosPublic.get('/api/products?limit=50')).data,
  });
  const products = data?.products || [];

  const addProduct = (p) => {
    if (selected.length >= 4) return;
    if (selected.find((s) => s._id === p._id)) return;
    setSelected([...selected, p]);
    setPicker(false);
  };

  const rows = [
    { label: 'Price', render: (p) => `৳${p.price?.toLocaleString()}` },
    { label: 'Condition', render: (p) => p.condition },
    { label: 'Category', render: (p) => p.category },
    { label: 'Location', render: (p) => p.location || 'N/A' },
    { label: 'Seller', render: (p) => p.sellerInfo?.name },
    { label: 'Seller Verified', render: (p) => (p.sellerInfo?.verified ? '✓ Yes' : 'No') },
    { label: 'Stock', render: (p) => p.stock ?? 'N/A' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet><title>Compare Products | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Compare Products</h1>
      <p className="text-gray-500 mb-6">Compare up to 4 products side-by-side</p>

      {selected.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500 mb-4">Add products to start comparing.</p>
          <button onClick={() => setPicker(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700">
            <FiPlus /> Add Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left w-40 bg-gray-50"></th>
                {selected.map((p) => (
                  <th key={p._id} className="p-4 text-center min-w-[180px] border-l border-gray-100">
                    <button onClick={() => setSelected(selected.filter((s) => s._id !== p._id))} className="float-right text-gray-400 hover:text-red-500"><FiX /></button>
                    <img src={p.images?.[0]} alt="" className="w-24 h-24 object-cover rounded-lg mx-auto mb-2" />
                    <Link to={`/products/${p._id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2">{p.title}</Link>
                  </th>
                ))}
                {selected.length < 4 && (
                  <th className="p-4 border-l border-gray-100">
                    <button onClick={() => setPicker(true)} className="text-blue-600 flex flex-col items-center gap-1 mx-auto">
                      <FiPlus className="text-2xl" /><span className="text-xs">Add</span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-gray-100">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">{row.label}</td>
                  {selected.map((p) => (
                    <td key={p._id} className="p-4 text-center text-sm text-gray-600 border-l border-gray-100">{row.render(p)}</td>
                  ))}
                  {selected.length < 4 && <td className="border-l border-gray-100" />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Picker modal */}
      {picker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setPicker(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900">Select a Product</h2>
              <button onClick={() => setPicker(false)} className="text-gray-400"><FiX /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map((p) => (
                <button key={p._id} onClick={() => addProduct(p)} className="text-left border border-gray-100 rounded-lg p-2 hover:border-blue-400 transition-colors">
                  <img src={p.images?.[0]} alt="" className="w-full h-24 object-cover rounded mb-1" />
                  <p className="text-xs font-medium line-clamp-1">{p.title}</p>
                  <p className="text-xs text-blue-700">৳{p.price?.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareProducts;
