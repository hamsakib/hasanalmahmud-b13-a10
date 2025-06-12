import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Spinner } from '../../../components/shared/Loader';

const AdminProducts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await axiosSecure.get('/api/products/all-admin')).data,
  });

  const approvalMutation = useMutation({
    mutationFn: ({ id, approvalStatus }) => axiosSecure.patch(`/api/products/${id}/approval`, { approvalStatus }),
    onSuccess: () => { toast.success('Product status updated'); queryClient.invalidateQueries({ queryKey: ['admin-products'] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/products/admin/${id}`),
    onSuccess: () => { toast.success('Product deleted'); queryClient.invalidateQueries({ queryKey: ['admin-products'] }); },
  });

  return (
    <div>
      <Helmet><title>Manage Products | ReSell Hub</title></Helmet>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Products</h1>

      {isLoading ? <Spinner /> : products.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">No products to moderate.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Seller</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Reports</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className={p.reportCount > 0 ? 'bg-red-50/40' : ''}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-gray-900 line-clamp-1 max-w-[160px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.sellerInfo?.name}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">৳{p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {p.reportCount > 0 ? <span className="text-red-600 font-medium">{p.reportCount} ⚠</span> : <span className="text-gray-400">0</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                      p.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                      p.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {p.approvalStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-1">
                    <button onClick={() => approvalMutation.mutate({ id: p._id, approvalStatus: 'approved' })} title="Approve" className="text-green-600 hover:bg-green-50 p-1.5 rounded"><FiCheck /></button>
                    <button onClick={() => approvalMutation.mutate({ id: p._id, approvalStatus: 'rejected' })} title="Reject" className="text-amber-600 hover:bg-amber-50 p-1.5 rounded"><FiX /></button>
                    <button onClick={() => deleteMutation.mutate(p._id)} title="Delete" className="text-red-600 hover:bg-red-50 p-1.5 rounded"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
