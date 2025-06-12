import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { CATEGORIES } from '../../Home/sections/PopularCategories';

const CONDITIONS = ['New', 'Like New', 'Good', 'Used', 'Refurbished'];

const AddProduct = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [imageInputs, setImageInputs] = useState(['']);

  const mutation = useMutation({
    mutationFn: (product) => axiosSecure.post('/api/products', product),
    onSuccess: () => {
      toast.success('Product added successfully!');
      navigate('/dashboard/my-products');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add product'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const images = imageInputs.map((_, i) => form[`image${i}`].value).filter(Boolean);
    if (images.length === 0) return toast.error('Add at least one image URL');

    const product = {
      title: form.title.value,
      category: form.category.value,
      condition: form.condition.value,
      price: parseFloat(form.price.value),
      stock: parseInt(form.stock.value),
      location: form.location.value,
      description: form.description.value,
      images,
    };
    mutation.mutate(product);
  };

  return (
    <div className="max-w-3xl">
      <Helmet><title>Add Product | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Product Title</label>
          <input name="title" required placeholder="e.g. Used Dell Inspiron 15 Laptop" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
            <select name="category" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Condition</label>
            <select name="condition" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Price (৳)</label>
            <input name="price" type="number" required min="0" placeholder="35000" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Stock</label>
            <input name="stock" type="number" required min="1" defaultValue="1" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Location</label>
            <input name="location" required placeholder="Dhaka" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Image URLs</label>
          {imageInputs.map((_, i) => (
            <input key={i} name={`image${i}`} placeholder={`Image URL ${i + 1}`} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2" />
          ))}
          <button type="button" onClick={() => setImageInputs([...imageInputs, ''])} className="text-sm text-blue-600 hover:underline">
            + Add another image
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
          <textarea name="description" required rows={4} placeholder="Describe the product, its specs and condition..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
        </div>

        <button type="submit" disabled={mutation.isPending} className="bg-blue-600 text-white font-semibold px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          {mutation.isPending ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
