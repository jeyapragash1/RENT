"use client";
import { useEffect, useState } from "react";
import { API_BASE } from '../../../lib/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please log in as admin.");
      setLoading(false);
      return;
    }

  fetch(`${API_BASE}/api/admin/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
    })
      .then((r) => {
        if (!r.ok) throw r;
        return r.json();
      })
      .then((json) => setData(json))
      .catch(async (err) => {
        try {
          const body = await err.json();
          setError(body.message || "Failed to fetch dashboard");
        } catch (e) {
          setError("Failed to fetch dashboard");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading dashboard…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={data.counts.total_users} />
        <StatCard title="Customers" value={data.counts.total_customers} />
        <StatCard title="Sellers" value={data.counts.total_sellers} />
        <StatCard title="Active Rentals" value={data.counts.active_rentals} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PaymentCard title="Today" amount={data.payments.today} />
        <PaymentCard title="Yesterday" amount={data.payments.yesterday} />
        <PaymentCard title="Last 7 days" amount={data.payments.last_7_days} />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.vehicles && data.vehicles.length ? (
            data.vehicles.map((v) => (
              <div key={v.id} className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold">{v.title || v.make || 'Vehicle'}</h3>
                <p className="text-sm text-gray-600">Owner: {v.owner?.name || '—'}</p>
                <p className="text-sm text-gray-600">Status: {v.status}</p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-white rounded shadow">No vehicles found</div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value ?? '—'}</div>
    </div>
  );
}

function PaymentCard({ title, amount }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="text-sm text-gray-500">Payments — {title}</div>
      <div className="text-2xl font-bold">${Number(amount || 0).toFixed(2)}</div>
    </div>
  );
}
