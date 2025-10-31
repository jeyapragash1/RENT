'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RentalRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null }); // Clear field error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:8000/api/customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || {});
        alert('Please fix the errors and try again.');
      } else {
        alert(data.message || 'Registration successful!');
        setForm({ name: '', email: '', phone: '', address: '', password: '' });
        router.push('/rentalLogin');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong! Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl flex flex-col md:flex-row max-w-6xl w-full overflow-hidden">

        {/* Left Side - Info & Navigation */}
        <div className="md:w-1/2 relative bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col justify-center items-center p-6">
          <button
            className="absolute top-4 left-4 bg-white text-purple-700 font-semibold px-4 py-2 rounded-full hover:opacity-90 transition"
            onClick={() => router.push('/')}
          >
            Home
          </button>

          <img src="/car.png" alt="Rental Car" className="w-3/4 object-contain mb-6" />
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Rental</h1>
          <p className="text-white/90 text-center">
            Reliable, affordable car rentals at your fingertips.
          </p>

          <div className="mt-6 flex flex-col gap-3 w-full px-10">
            <button
              className="bg-white text-purple-700 font-semibold py-2 rounded-full hover:opacity-90 transition"
              onClick={() => router.push('/rentalLogin')}
            >
              Sign In
            </button>
            <button
              className="bg-white text-purple-700 font-semibold py-2 rounded-full hover:opacity-90 transition"
              onClick={() => router.push('/all-vehicle')}
            >
              All Vehicles
            </button>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="md:w-1/2 bg-indigo-50 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register Now</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              icon="👤"
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <InputField
              icon="📧"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField
              icon="📞"
              placeholder="Phone No."
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <InputField
              icon="📍"
              placeholder="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              error={errors.address}
            />
            <InputField
              icon="🔒"
              placeholder="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, placeholder, type = "text", name, value, onChange, error }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-purple-400 transition">
        <span className="mr-3 text-lg">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className="bg-transparent focus:outline-none w-full text-black placeholder:text-gray-500"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
}
