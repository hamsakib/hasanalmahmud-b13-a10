import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Spinner } from '../../../components/shared/Loader';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => (await axiosSecure.get('/api/users')).data,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => axiosSecure.patch(`/api/users/${id}/role`, { role }),
    onSuccess: () => { toast.success('Role updated'); queryClient.invalidateQueries({ queryKey: ['all-users'] }); },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => axiosSecure.patch(`/api/users/${id}/status`, { status }),
    onSuccess: () => { toast.success('Status updated'); queryClient.invalidateQueries({ queryKey: ['all-users'] }); },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }) => axiosSecure.patch(`/api/users/${id}/verify`, { verified }),
    onSuccess: () => { toast.success('Verification updated'); queryClient.invalidateQueries({ queryKey: ['all-users'] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/users/${id}`),
    onSuccess: () => { toast.success('User deleted'); queryClient.invalidateQueries({ queryKey: ['all-users'] }); },
  });

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Helmet><title>Manage Users | ReSell Hub</title></Helmet>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
      </div>

      {isLoading ? <Spinner /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Verified</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.photo || `https://ui-avatars.com/api/?name=${u.name}&background=2563eb&color=fff`} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select value={u.role} onChange={(e) => roleMutation.mutate({ id: u._id, role: e.target.value })} className="text-xs border border-gray-200 rounded-lg px-2 py-1 capitalize focus:outline-none">
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${u.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => verifyMutation.mutate({ id: u._id, verified: !u.verified })} className={`text-xs px-2 py-1 rounded-lg ${u.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.verified ? '✓ Verified' : 'Verify'}
                    </button>
                  </td>
                  <td className="px-4 py-3 flex gap-2 items-center">
                    <button
                      onClick={() => statusMutation.mutate({ id: u._id, status: u.status === 'blocked' ? 'active' : 'blocked' })}
                      className={`text-xs px-3 py-1 rounded-lg ${u.status === 'blocked' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}
                    >
                      {u.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
                    <button onClick={() => deleteMutation.mutate(u._id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded"><FiTrash2 /></button>
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

export default ManageUsers;
