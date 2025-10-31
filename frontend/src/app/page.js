"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaFacebook,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaCarSide,
  FaClock,
  FaShieldAlt,
  FaThumbsUp,
} from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [featured, setFeatured] = useState([]);
  const [fvLoading, setFvLoading] = useState(true);

  // Search form state
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      setFvLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/vehicles/approved');
        if (!res.ok) throw new Error('Failed to load featured vehicles');
        const data = await res.json();
        setFeatured(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFvLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen font-sans text-white">
      {/* ===== Header + Hero (Combined Background) ===== */}
      <section
        className="relative bg-cover bg-center min-h-[60vh]"
        style={{
          backgroundImage: "url('/images/logo.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* ===== Header ===== */}
        <div className="relative z-10">
          <header className="flex justify-between items-center px-8 py-6 text-white">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src="/images/modern-car-rental-logo-template-auto-service-and-ride-share-branding-vector.jpg"
                alt="Rental Logo"
                className="w-12 h-12 object-contain rounded-full bg-white p-1"
              />
              <span className="text-2xl font-bold tracking-wide">Rental</span>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-6 text-lg">
              <button
                onClick={() => router.push("/")}
                className="text-yellow-300 border-b-2 border-yellow-300 pb-1 transition"
              >
                Home
              </button>
              <button
                onClick={() => router.push("/all-vehicle")}
                className="hover:text-yellow-300 transition"
              >
                Rent a Vehicle
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => router.push("/rentalRegister")}
                className="px-4 py-2 bg-white text-purple-700 rounded-md font-semibold hover:bg-yellow-300 transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => router.push("/rentalLogin")}
                className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-purple-700 transition"
              >
                Sign In
              </button>
            </div>
          </header>

          {/* ===== Hero Text + Search ===== */}
          <div className="flex flex-col items-center justify-center text-center mt-16 px-6">
            <h1 className="text-5xl font-bold mb-4">
              The Power of Mobility With Our Vehicles
            </h1>
            <p className="text-lg text-gray-200 mb-6">
              Reliable, Affordable, and Convenient Rentals — find the perfect ride in seconds
            </p>

            {/* Search Card */}
            <div className="w-full max-w-4xl bg-white bg-opacity-90 text-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Pickup location"
                  className="flex-1 p-3 rounded border border-gray-200"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-3 rounded border border-gray-200"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-3 rounded border border-gray-200"
                />
                <button
                  onClick={() => router.push(`/all-vehicle?location=${encodeURIComponent(location)}&start=${startDate}&end=${endDate}`)}
                  className="bg-purple-700 text-white px-6 py-3 rounded font-semibold hover:bg-purple-800"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Vehicle Showcase ===== */}
      <section className="py-10 bg-white text-center text-gray-900">
        <h2 className="text-2xl font-semibold mb-6">Featured Vehicles</h2>

        {/* Summary cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 px-4">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="text-sm text-gray-600">Available Vehicles</h4>
            <p className="text-2xl font-bold mt-2 text-gray-900">{featured.length}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="text-sm text-gray-600">Sellers</h4>
            <p className="text-2xl font-bold mt-2 text-gray-900">{new Set((featured || []).map(f => f.user_id)).size}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="text-sm text-gray-600">Popular</h4>
            <p className="text-2xl font-bold mt-2 text-gray-900">Top Picks</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 px-4">
          {fvLoading ? (
            <p>Loading featured vehicles...</p>
          ) : (
            (featured.slice(0, 6).map((v) => (
              <div key={v.id} className="w-64 bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={v.image_url || '/images/download (5).jpg'} alt={v.brand + ' ' + v.model} className="w-full h-40 object-cover" />
                <div className="p-4 text-gray-900 text-left">
                  <h3 className="font-semibold">{v.brand} {v.model}</h3>
                  <p className="text-sm text-gray-600">{v.color} • {v.registration_number}</p>
                  <p className="mt-2 text-lg font-bold">Rs. {v.daily_rate}/day</p>
                </div>
              </div>
            )))
          )}
        </div>
      </section>

      {/* ===== Top Sellers ===== */}
      <section className="py-12 bg-gray-50 text-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 text-center">Top Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              // compute sellers from featured vehicles
              const sellersMap = {};
              (featured || []).forEach(v => {
                const owner = v.owner || { id: v.user_id, name: v.owner?.name || 'Seller' };
                const id = owner.id || v.user_id;
                if (!sellersMap[id]) sellersMap[id] = { name: owner.name || 'Seller', count: 0, samples: [] };
                sellersMap[id].count++;
                if (sellersMap[id].samples.length < 2) sellersMap[id].samples.push(v.image_url);
              });
              const sellers = Object.values(sellersMap).sort((a,b) => b.count - a.count).slice(0,3);
              if (!sellers.length) return <p className="text-center">No sellers yet.</p>;
              return sellers.map((s, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-200 mb-3 flex items-center justify-center text-xl font-bold">{s.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-sm text-gray-500">{s.count} vehicle(s)</p>
                  <div className="flex gap-2 mt-3">
                    {s.samples.map((img, i) => (
                      <img key={i} src={img || '/images/download (5).jpg'} alt="sample" className="w-16 h-10 object-cover rounded" />
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="py-12 bg-white text-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-6">What our customers say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              name: 'Aisha Khan',
              text: 'Great service and clean cars. Highly recommended!'
            },{
              name: 'Samir Ali',
              text: 'Easy booking and friendly support. Saved me a lot of time.'
            },{
              name: 'Rita Gomez',
              text: 'Affordable rates and very reliable vehicles.'
            }].map((t, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg shadow">
                <p className="text-gray-700">“{t.text}”</p>
                <p className="mt-4 font-semibold">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section className="py-10 bg-gradient-to-r from-purple-700 to-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Have a vehicle to rent?</h3>
            <p className="text-gray-200 mt-2">Join our platform and start earning by listing your vehicle today.</p>
          </div>
          <div>
            <button onClick={() => router.push('/rentalRegister')} className="px-6 py-3 bg-white text-purple-700 rounded font-semibold hover:opacity-90">Become a Seller</button>
          </div>
        </div>
      </section>

      {/* ===== Why Choose Rental ===== */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">
          Why Choose Rental
        </h2>
        <div className="grid md:grid-cols-4 gap-8 px-8">
          {[
            { icon: <FaThumbsUp />, title: "Quality Cars", text: "Well-maintained, reliable vehicles for all travel needs." },
            { icon: <FaCarSide />, title: "Good Service", text: "Professional support and flexible rental options." },
            { icon: <FaClock />, title: "24/7 Support", text: "Anytime assistance for booking and emergencies." },
            { icon: <FaShieldAlt />, title: "Safety", text: "Fully insured and sanitized vehicles for peace of mind." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-700">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-900 text-white py-10 px-8 grid md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="font-bold text-lg mb-3">About Us</h3>
          <p className="text-sm leading-relaxed">
            We provide reliable vehicle rental services for all occasions—
            business trips, vacations, and deliveries. Enjoy transparent pricing,
            great service, and trusted vehicles.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-lg mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <FaFacebook /> <span>Facebook</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaEnvelope /> <span>Email</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaPhone /> <span>Phone No</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaWhatsapp /> <span>WhatsApp</span>
            </li>
          </ul>
        </div>

        {/* Feedback */}
        <div>
          <h3 className="font-bold text-lg mb-3">Share Your Feedback</h3>
          <form className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Name"
              className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
            />
            <textarea
              placeholder="Message"
              className="p-2 rounded bg-gray-800 border border-gray-700 h-20 focus:outline-none"
            />
            <button className="bg-purple-600 hover:bg-purple-500 py-2 rounded font-semibold">
              Send
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
