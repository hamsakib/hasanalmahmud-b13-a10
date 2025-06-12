import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Spinner } from '../../../components/shared/Loader';
import { CATEGORIES } from '../../Home/sections/PopularCategories';

const CONDITIONS = ['New', 'Like New', 'Good', 'Used', 'Refurbished'];

const MyProducts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['my-products'],
    queryFn: async () => (await axiosSecure.get('/api/products/my-products')).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/products/${id}`),
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axiosSecure.patch(`/api/products/${id}`, data),
    onSuccess: () => {
      toast.success('Product updated');
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
  });

  const filtered = products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    updateMutation.mutate({
      id: editing._id,
      data: {
        title: form.title.value,
        price: parseFloat(form.price.value),
        category: form.category.value,
        condition: form.condition.value,
        stock: parseInt(form.stock.value),
        description: form.description.value,
      },
    });
  };

  return (
    <div>
      <Helmet><title>My Products | ReSell Hub</title></Helmet>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <Link to="/dashboard/add-product" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">+ Add</Link>
        </div>
      </div>

      {isLoading ? <Spinner /> : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">No products found.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-gray-900 line-clamp-1 max-w-[180px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">৳{p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                      p.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                      p.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {p.approvalStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => setEditing(p)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"><FiEdit2 /></button>
                    <button onClick={() => deleteMutation.mutate(p._id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <form onSubmit={handleUpdate} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
              <button type="button" onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
            </div>
            <div className="space-y-3">
              <input name="title" defaultValue={editing.title} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select name="category" defaultValue={editing.category} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg">
                  {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <select name="condition" defaultValue={editing.condition} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg">
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="price" type="number" defaultValue={editing.price} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" />
                <input name="stock" type="number" defaultValue={editing.stock} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" />
              </div>
              <textarea name="description" defaultValue={editing.description} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg resize-none" />
              <button type="submit" disabled={updateMutation.isPending} className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {updateMutation.isPending ? 'Saving...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
