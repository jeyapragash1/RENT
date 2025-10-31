'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [active, setActive] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [counts, setCounts] = useState({});
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  const fetchData = async () => {
    if (!token) {
      router.push('/'); 
      return;
    }

    try {
      // Fetch dashboard summary
      const res = await fetch('http://localhost:8000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setCounts(data.counts || {});
      setPayments(data.payments || {});
      setVehicles(data.vehicles || []);

      // Fetch customers list separately
      const cRes = await fetch('http://localhost:8000/api/admin/customers', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!cRes.ok) throw new Error('Failed to fetch customers');
      const cData = await cRes.json();
      setCustomers(cData || []);
    } catch (err) {
      console.error(err);
      alert('Session expired or failed to fetch data.');
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Delete customer
  const deleteCustomer = async (id) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/admin/customers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete customer');
      alert('Customer deleted successfully');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error deleting customer');
    }
  };

  // Approve vehicle
  const approveVehicle = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/vehicles/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to approve vehicle');
      alert('Vehicle approved successfully');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error approving vehicle');
    }
  };

  // Reject vehicle
  const rejectVehicle = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/vehicles/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to reject vehicle');
      alert('Vehicle rejected successfully');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error rejecting vehicle');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-700 to-purple-900 text-white flex flex-col">
        <div className="px-6 py-6 text-2xl font-bold tracking-wide border-b border-purple-600">
          🚗 Rental Admin
        </div>
        <nav className="flex-1 mt-6 space-y-1">
          {/* Only Dashboard link remains */}
          <button
            onClick={() => setActive('dashboard')}
            className={`block w-full text-left px-6 py-3 rounded-r-full font-medium transition ${
              active === 'dashboard' ? 'bg-white text-purple-800 shadow-lg' : 'hover:bg-purple-800/50'
            }`}
          >
            Dashboard
          </button>
        </nav>
        <div className="p-6 border-t border-purple-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Welcome, Admin 👋</h1>
          <div className="flex items-center gap-4">
            <input type="text" placeholder="Search..." className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400" />
            <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">A</div>
          </div>
        </div>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-gray-500 text-sm">Total Users</h3>
            <p className="text-3xl font-semibold text-purple-700 mt-2">{counts.total_users ?? '-'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-gray-500 text-sm">Customers</h3>
            <p className="text-3xl font-semibold text-purple-700 mt-2">{counts.total_customers ?? '-'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-gray-500 text-sm">Sellers</h3>
            <p className="text-3xl font-semibold text-purple-700 mt-2">{counts.total_sellers ?? '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-gray-500 text-sm">Active Rentals</h3>
            <p className="text-3xl font-semibold text-purple-700 mt-2">{counts.active_rentals ?? '-'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-gray-500 text-sm">Payments Today</h3>
            <p className="text-3xl font-semibold text-green-600 mt-2">Rs. {payments.today ?? 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-gray-500 text-sm">Payments (7 days)</h3>
            <p className="text-3xl font-semibold text-green-600 mt-2">Rs. {payments.last_7_days ?? 0}</p>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          {loading ? <p>Loading...</p> : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, i) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4">{customer.name}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">{customer.phone || '-'}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Vehicles Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Vehicles</h2>
          {loading ? <p>Loading...</p> : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle, i) => (
                  <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4">{vehicle.brand}</td>
                    <td className="py-3 px-4">{vehicle.model}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        vehicle.status === 'Pending' ? 'bg-yellow-400 text-white' :
                        vehicle.status === 'Approved' ? 'bg-green-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      {vehicle.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => approveVehicle(vehicle.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectVehicle(vehicle.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
