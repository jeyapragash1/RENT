'use client';

import { useState, useEffect } from "react";
import { API_BASE } from '../lib/api';
import { useRouter } from "next/navigation";
import {
  FaCar, FaCogs, FaUser, FaCalendarAlt, FaIdCard, FaMoneyBill, FaSignOutAlt
} from "react-icons/fa";

// Rent Popup
function RentPopup({ vehicle, user, onClose, onConfirm }) {
  const [rentStartDate, setRentStartDate] = useState("");
  const [rentEndDate, setRentEndDate] = useState("");
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    if (rentStartDate && rentEndDate) {
      const start = new Date(rentStartDate);
      const end = new Date(rentEndDate);
      const diffTime = end - start;
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setTotalPayment(diffDays * vehicle.dailyRate);
    } else {
      setTotalPayment(0);
    }
  }, [rentStartDate, rentEndDate, vehicle]);

  const handleConfirm = () => {
    if (!rentStartDate || !rentEndDate) {
      alert("Please select start and end dates.");
      return;
    }
    if (new Date(rentEndDate) < new Date(rentStartDate)) {
      alert("End date cannot be before start date.");
      return;
    }
    onConfirm({ startDate: rentStartDate, endDate: rentEndDate });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded-xl w-11/12 max-w-md shadow-xl text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Rent {vehicle.model}</h2>

        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
        </div>

        <div className="mb-3">
          <label className="block mb-1">Start Date:</label>
          <input
            type="date"
            value={rentStartDate}
            onChange={(e) => setRentStartDate(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-black"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">End Date:</label>
          <input
            type="date"
            value={rentEndDate}
            onChange={(e) => setRentEndDate(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-black"
          />
        </div>

        <div className="mb-4">
          <p><strong>Total Payment:</strong> Rs. {totalPayment}</p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Confirm Rent
          </button>
        </div>
      </div>
    </div>
  );
}

// Login Warning Popup
function LoginWarningPopup({ onClose }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-11/12 max-w-sm shadow-xl text-black text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">Not Logged In</h2>
        <p className="mb-6">You must log in to rent a vehicle.</p>
        <button
          onClick={() => {
            onClose();
            router.push("/rentalLogin");
          }}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

// Vehicle Detail Component
function Detail({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-purple-100 p-2 rounded-lg shadow-sm">
      <span className="text-purple-500 text-lg">{icon}</span>
      <p className="text-black text-sm"><strong>{label}:</strong> {value}</p>
    </div>
  );
}

// Main Available Vehicles Component
export default function AvailableVehicles() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showRentPopup, setShowRentPopup] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
  const res = await fetch(`${API_BASE}/api/vehicles/approved`);
        if (!res.ok) throw new Error("Failed to fetch vehicles");
        const data = await res.json();
        const formatted = data.map((v) => ({
          ...v,
          ownerName: v.owner?.name || "Unknown",
          regDate: v.registration_date,
          regNo: v.registration_number,
          dailyRate: v.daily_rate,
          image: v.image
            ? `${API_BASE}/storage/${v.image}`
            : "/images/logo.jpg",
        }));
        setVehicles(formatted);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleRentClick = (vehicle) => {
    if (!currentUser) {
      setShowLoginWarning(true);
      return;
    }
    setSelectedVehicle(vehicle);
    setShowRentPopup(true);
  };

  const handleRentConfirm = async ({ startDate, endDate }) => {
    try {
      if (!startDate || !endDate) {
        alert("Please select valid start and end dates.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setShowRentPopup(false);
        setShowLoginWarning(true);
        return;
      }

      const payload = {
        vehicle_id: selectedVehicle.id,
        customer_id: currentUser.id,
        rent_start_date: startDate,
        rent_end_date: endDate,
      };

  const res = await fetch(`${API_BASE}/api/rentals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to rent the vehicle");
      }

      // If rental created, prompt for payment option (full/half/none)
      const rental = data.rental || data;
      if (!rental || !rental.id) {
        alert('Rental created but could not determine rental id.');
        setShowRentPopup(false);
        setSelectedVehicle(null);
        return;
      }

      // Ask user whether to pay full, half, or pay later
      const choice = window.prompt('Type FULL to pay full now, HALF to pay half now, or NONE to pay later', 'FULL');
      let amountToPay = 0;
      if (choice && choice.toUpperCase() === 'HALF') {
        amountToPay = Number(rental.total_amount) / 2;
      } else if (choice && choice.toUpperCase() === 'NONE') {
        amountToPay = 0;
      } else {
        amountToPay = Number(rental.total_amount);
      }

      setShowRentPopup(false);
      setSelectedVehicle(null);

      if (amountToPay > 0) {
        // Create a form to POST to the backend PayHere create endpoint so server can redirect to PayHere
        const form = document.createElement('form');
        form.method = 'POST';
  form.action = `${API_BASE}/api/payhere/create`;
        form.style.display = 'none';

        const addField = (name, value) => {
          const i = document.createElement('input');
          i.type = 'hidden';
          i.name = name;
          i.value = value;
          form.appendChild(i);
        };

        addField('rental_id', rental.id);
        addField('amount', amountToPay.toFixed(2));

        document.body.appendChild(form);
        form.submit();
      } else {
        alert(`Rental created. You can pay later from your profile or contact the admin.`);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong while renting the vehicle.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    router.push("/rentalLogin");
  };

  if (loading) return <p className="text-center mt-20 text-xl text-black">Loading vehicles...</p>;
  if (error) return <p className="text-center mt-20 text-xl text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center py-6 font-sans">

      {/* Top Bar */}
      <div className="w-full flex justify-between items-center px-10 py-4 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <FaCar className="text-purple-500" /> Vehicle Rentals
        </h1>
        {currentUser ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/rentalprofile")}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors"
            >
              <FaUser /> {currentUser.name.split(" ")[0]}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/rentalLogin")}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
          >
            <FaUser /> Login
          </button>
        )}
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-11/12 max-w-6xl">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
            <img src={vehicle.image} alt={vehicle.model} className="w-full h-56 object-cover" />
            <div className="p-5 flex flex-col gap-3">
              <h2 className="text-2xl font-bold text-black">{vehicle.model}</h2>
              <Detail icon={<FaUser />} label="Owner" value={vehicle.ownerName} />
              <Detail icon={<FaCalendarAlt />} label="Registration Date" value={vehicle.regDate} />
              <Detail icon={<FaIdCard />} label="Reg. No." value={vehicle.regNo} />
              <Detail icon={<FaMoneyBill />} label="Daily Rate" value={`Rs. ${vehicle.dailyRate}`} />
              <button
                onClick={() => handleRentClick(vehicle)}
                className="mt-3 w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Rent
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popups */}
      {showRentPopup && selectedVehicle && currentUser && (
        <RentPopup
          vehicle={selectedVehicle}
          user={currentUser}
          onClose={() => setShowRentPopup(false)}
          onConfirm={handleRentConfirm}
        />
      )}

      {showLoginWarning && <LoginWarningPopup onClose={() => setShowLoginWarning(false)} />}
    </div>
  );
}
