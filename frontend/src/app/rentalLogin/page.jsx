'use client';
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isAdmin ? 
        "http://localhost:8000/api/admin/login" : 
        "http://localhost:8000/api/customers/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // For compatibility with existing admin pages that expect 'admin_token'
      if (isAdmin) {
        localStorage.setItem('admin_token', data.token);
      }

      alert("Login successful!");
      // Redirect admin users to admin dashboard; regular users to vehicles
      if (isAdmin) {
        // Redirect to the existing rental admin dashboard page (rentalAdmin)
        window.location.href = "/rentalAdmin";
      } else {
        window.location.href = "/all-vehicle"; // ✅ redirect after login
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-100 flex justify-center items-center">
      <img
        src="/images/your-gate-way-to-safe-and-comfortable-tourism.jpg"
        alt="Car"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center">
        <div className="w-full flex justify-between items-center px-8 py-4">
          <img
            src="/images/modern-car-rental-logo-template-auto-service-and-ride-share-branding-vector.jpg"
            alt="Logo"
            className="w-16 h-16 object-cover rounded-full"
          />
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-full hover:opacity-90 transition"
          >
            Home
          </button>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-16 text-center">
          Welcome Back to Rental
        </h1>
        <div className="flex-1"></div>
        <div className="w-full max-w-md bg-white rounded-xl p-8 mb-16 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login to Your Account
          </h2>
          <form onSubmit={handleSubmit}>
            <label className="flex items-center gap-3 mb-4">
              <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm text-gray-600">Login as Admin</span>
            </label>
            <Input
              icon="📧"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              icon="🔒"
              placeholder="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-purple-700 text-white py-2 rounded-full font-semibold hover:bg-purple-800 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ icon, placeholder, type = "text", value, onChange, name }) {
  return (
    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full mb-4 shadow-sm">
      <span className="mr-3 text-xl">{icon}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-transparent w-full focus:outline-none text-gray-700 placeholder:text-gray-500"
        required
      />
    </div>
  );
}
