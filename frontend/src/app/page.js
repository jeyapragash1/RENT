"use client";

import React, { useEffect, useState } from "react";
import { API_BASE } from '../lib/api';
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

// Interactive FAQ accordion used in the page
function FAQList() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: 'How do I book a vehicle?', a: 'Search for a vehicle, select dates, then confirm booking and pay securely.' },
    { q: 'What documents are required?', a: 'A valid driving license and a government ID are typically required.' },
    { q: 'Can I cancel my booking?', a: 'Yes — cancellation policy depends on the vehicle owner; check the booking details.' },
  ];

  return (
    <div className="space-y-4">
      {faqs.map((f, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow">
          <button className="w-full text-left flex justify-between items-center" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            <span className="font-semibold text-gray-800">{f.q}</span>
            <span className="text-gray-500">{openIndex === i ? '-' : '+'}</span>
          </button>
          {openIndex === i && (
            <p className="text-sm text-gray-600 mt-3">{f.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

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
        const res = await fetch(`${API_BASE}/api/vehicles/approved`);
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

        <div className="relative z-10">
          {/* ===== Hero Text + Search ===== */}
          <div className="flex flex-col items-center justify-center text-center mt-8 px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              The Power of Mobility With Our Vehicles
            </h1>
            <p className="text-base md:text-lg text-gray-200 mb-6 max-w-2xl">
              Reliable, Affordable, and Convenient Rentals — find the perfect ride in seconds
            </p>

            {/* Search Card */}
            <div className="w-full max-w-4xl bg-white bg-opacity-95 text-gray-900 rounded-xl p-5 shadow-lg">
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Pickup location"
                  className="flex-1 h-14 p-4 rounded-md border border-gray-200 placeholder-gray-400"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 p-3 rounded-md border border-gray-200"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 p-3 rounded-md border border-gray-200"
                />
                <button
                  onClick={() => router.push(`/all-vehicle?location=${encodeURIComponent(location)}&start=${startDate}&end=${endDate}`)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-md font-semibold hover:from-purple-700 hover:to-purple-800"
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

      {/* ===== Top Sellers =====
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
      </section> */}

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

      {/* ===== How It Works ===== */}
      <section className="py-16 bg-white text-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg shadow">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-600 text-white text-2xl">
                <FaCarSide />
              </div>
              <h3 className="font-semibold text-lg">Find a Vehicle</h3>
              <p className="text-sm text-gray-600 mt-2">Search by location, date, and price to find the perfect vehicle for your trip.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-600 text-white text-2xl">
                <FaClock />
              </div>
              <h3 className="font-semibold text-lg">Book & Confirm</h3>
              <p className="text-sm text-gray-600 mt-2">Select dates, confirm the rental, and pay securely — instant confirmations for many vehicles.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-600 text-white text-2xl">
                <FaShieldAlt />
              </div>
              <h3 className="font-semibold text-lg">Drive with Confidence</h3>
              <p className="text-sm text-gray-600 mt-2">Vehicles are checked by owners and backed by our platform policies for safety and reliability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Vehicle Categories ===== */}
      <section className="py-14 bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
          <p className="text-sm text-gray-600 mb-6">Browse vehicles grouped by brand and type.</p>
          <div className="flex flex-wrap gap-4">
            {(() => {
              const categories = {};
              (featured || []).forEach(v => {
                const key = v.brand || 'Other';
                categories[key] = (categories[key] || 0) + 1;
              });
              const cats = Object.keys(categories).slice(0, 8);
              if (!cats.length) return <p className="text-sm">No categories yet.</p>;
              return cats.map((c) => (
                <div key={c} className="bg-white rounded-lg shadow py-4 px-6">
                  <h4 className="font-semibold">{c}</h4>
                  <p className="text-sm text-gray-500">{categories[c]} vehicle(s)</p>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* ===== Pricing Plans ===== */}
      <section className="py-16 bg-white text-gray-900">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Simple Pricing</h2>
          <p className="text-gray-600 mb-8">Transparent fees — pay only for the days you use.</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold">Basic</h3>
              <p className="text-3xl font-bold mt-4">Rs. 0<span className="text-base font-medium">/listing</span></p>
              <ul className="text-sm text-gray-600 mt-4 space-y-2">
                <li>List vehicles</li>
                <li>Basic support</li>
              </ul>
              <button className="mt-6 px-4 py-2 bg-purple-700 text-white rounded">Get Started</button>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold">Standard</h3>
              <p className="text-3xl font-bold mt-4">Rs. 199<span className="text-base font-medium">/month</span></p>
              <ul className="text-sm text-gray-600 mt-4 space-y-2">
                <li>Featured listings</li>
                <li>Priority support</li>
              </ul>
              <button className="mt-6 px-4 py-2 bg-purple-700 text-white rounded">Choose Plan</button>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold">Premium</h3>
              <p className="text-3xl font-bold mt-4">Rs. 499<span className="text-base font-medium">/month</span></p>
              <ul className="text-sm text-gray-600 mt-4 space-y-2">
                <li>Top placement</li>
                <li>Dedicated manager</li>
              </ul>
              <button className="mt-6 px-4 py-2 bg-purple-700 text-white rounded">Upgrade</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-12 bg-gray-50 text-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <FAQList />
        </div>
      </section>

      {/* ===== Newsletter / CTA ===== */}
      <section className="py-10 bg-gradient-to-r from-purple-700 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Stay in the loop</h3>
            <p className="text-gray-100 mt-2">Subscribe for deals, new vehicles and seasonal offers.</p>
          </div>
          <form className="flex w-full md:w-auto gap-2" onSubmit={(e)=>{e.preventDefault(); alert('Thanks for subscribing!')}}>
            <input type="email" required placeholder="Enter your email" className="p-3 rounded text-gray-900" />
            <button className="px-5 py-3 bg-white text-purple-700 rounded font-semibold">Subscribe</button>
          </form>
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
