'use client';
import { useEffect, useState } from 'react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const backendUrl = 'http://localhost:8000';

  const fetchCustomers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Not logged in');

    try {
      const res = await fetch(`${backendUrl}/api/admin/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      const res = await fetch(`${backendUrl}/api/admin/customers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete customer');
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Customers Management</h1>

      {/* Search */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 w-64"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c, i) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.phone}</td>
                <td className="px-4 py-2">{c.address}</td>
                <td className="px-4 py-2 flex justify-end gap-2">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No customers found.</p>
        )}
      </div>
    </div>
  );
}
