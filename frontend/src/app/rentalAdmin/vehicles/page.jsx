'use client';
import { useEffect, useState } from 'react';
import { API_BASE } from '../../../lib/api';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const backendUrl = API_BASE;

  const fetchVehicles = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Not logged in');

    try {
  const res = await fetch(`${backendUrl}/api/admin/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
  const res = await fetch(`${backendUrl}/api/admin/vehicles/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to approve');
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    try {
  const res = await fetch(`${backendUrl}/api/admin/vehicles/${id}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to reject');
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
  const res = await fetch(`${backendUrl}/api/admin/vehicles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Vehicles Management</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Owner</th>
              <th className="px-4 py-2">Brand</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Rate</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, i) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{v.owner_name}</td>
                <td className="px-4 py-2">{v.brand}</td>
                <td className="px-4 py-2">{v.model}</td>
                <td className="px-4 py-2">${v.daily_rate}</td>
                <td className="px-4 py-2">
                  <span className={`px-3 py-1 rounded-full text-white text-xs ${
                    v.status === "Pending" ? "bg-yellow-400" :
                    v.status === "Approved" ? "bg-green-500" :
                    "bg-red-500"
                  }`}>{v.status}</span>
                </td>
                <td className="px-4 py-2 flex justify-end gap-2">
                  {v.status === 'Pending' && (
                    <>
                      <button onClick={() => handleApprove(v.id)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">Approve</button>
                      <button onClick={() => handleReject(v.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Reject</button>
                    </>
                  )}
                  <button onClick={() => handleDelete(v.id)} className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehicles.length === 0 && <p className="text-center text-gray-500 mt-4">No vehicles found.</p>}
      </div>
    </div>
  );
}
