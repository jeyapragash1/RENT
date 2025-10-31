'use client';
import { useState } from "react";
import { API_BASE } from '../../../lib/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else if (data.token) {
        localStorage.setItem("admin_token", data.token);
        window.location.href = "/rentalAdmin";
      } else {
        setError("Login failed");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Server/network error");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-200">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-black mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 text-black"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-black mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 text-black"
              placeholder="********"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-400 hover:bg-purple-500 text-black py-3 rounded-full font-semibold mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
