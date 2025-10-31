'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter(); // ✅ Router for navigation
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    daily_rate: "",
    registration_number: "",
    registration_date: "",
    color: "",
    brand: "",
    model: ""
  });
  const [vehicles, setVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const backendUrl = "http://localhost:8000";

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ").map(n => n[0].toUpperCase()).slice(0, 2).join("");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmitVehicle = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Not logged in!');

    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) payload.append(key, formData[key]);
    });

    try {
      const url = editingId
        ? `${backendUrl}/api/vehicles/${editingId}`
        : `${backendUrl}/api/vehicles`;
      const method = editingId ? "POST" : "POST"; 
      if (editingId) payload.append("_method", "PUT");

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (!res.ok) throw new Error("Failed to save vehicle");
      const data = await res.json();

      if (editingId) {
        setVehicles(vehicles.map(v => v.id === editingId ? data.vehicle : v));
        alert("Vehicle updated successfully!");
      } else {
        setVehicles([data, ...vehicles]);
        alert("Vehicle added successfully!");
      }

      setFormData({
        image: null,
        daily_rate: "",
        registration_number: "",
        registration_date: "",
        color: "",
        brand: "",
        model: ""
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save vehicle. Check console.");
    }
  };

  const handleDeleteVehicle = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Not logged in!');

    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const res = await fetch(`${backendUrl}/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete vehicle');

      setVehicles(vehicles.filter(v => v.id !== id));
      alert('Vehicle deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Error deleting vehicle.');
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      image: null,
      daily_rate: vehicle.daily_rate,
      registration_number: vehicle.registration_number,
      registration_date: vehicle.registration_date,
      color: vehicle.color,
      brand: vehicle.brand,
      model: vehicle.model,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push("/"); // ✅ Navigate to home on logout
  };

  const goHome = () => {
    router.push("/"); // ✅ Navigate to home on HOME button
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${backendUrl}/api/customers/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));

    fetch(`${backendUrl}/api/vehicles/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error(err));
  }, []);

  if (!user) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-purple-200 font-sans p-8">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl w-full max-w-[95%] min-h-[90vh] flex flex-col md:flex-row overflow-hidden">

        {/* LEFT SIDE */}
        <div className="md:w-1/3 w-full flex flex-col space-y-8 items-center border-b md:border-b-0 md:border-r border-purple-200 p-6 md:pr-6 overflow-y-auto">
          {/* Profile */}
          <div className="w-full bg-purple-100 p-6 rounded-2xl text-center mb-6">
            {user.profileImage ? (
              <img src={user.profileImage} alt="profile" className="w-36 h-36 rounded-full mx-auto mb-5 object-cover"/>
            ) : (
              <div className="w-36 h-36 rounded-full mx-auto mb-5 flex items-center justify-center bg-purple-400 text-white text-4xl font-bold">
                {getInitials(user.name)}
              </div>
            )}
            <h2 className="text-2xl font-semibold text-gray-700">Profile Details</h2>
            <div className="text-base text-gray-600 mt-4 space-y-2">
              <p>👤 Name: {user.name.split(" ")[0]}</p>
              <p>✉️ Email: {user.email}</p>
              <p>📞 Phone: {user.phone}</p>
              <p>🏠 Address: {user.address}</p>
            </div>
          </div>

          {/* Vehicles */}
          <div className="w-full bg-purple-100 p-5 rounded-2xl text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">My Vehicles</h2>
            {vehicles.length === 0 ? (
              <p className="text-gray-500">No vehicles added yet.</p>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {vehicles.map(v => (
                  <div key={v.id} className="p-3 bg-white rounded-lg shadow flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={v.image ? `${backendUrl}/storage/${v.image}` : "/images/logo.jpg"}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{v.brand} {v.model}</p>
                        <p className="text-sm text-gray-500">Rate: Rs. {v.daily_rate}/day</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-white text-xs ${
                        v.status === "Pending" ? "bg-yellow-400" :
                        v.status === "Approved" ? "bg-green-500" :
                        "bg-red-500"
                      }`}>
                        {v.status || "Pending"}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => handleEditVehicle(v)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(v.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col p-6 md:pl-8 justify-start overflow-auto">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
            <h2 className="text-3xl font-bold text-gray-700">
              {editingId ? "Edit Vehicle" : "Rent Your Vehicle"}
            </h2>
            <div className="flex flex-row md:flex-col gap-3">
              <button
                onClick={goHome}
                className="px-6 py-3 rounded-full bg-purple-400 hover:bg-purple-500 text-white"
              >
                HOME
              </button>
            
            </div>
          </div>

          {/* Vehicle Form */}
          <div className="mt-4 bg-purple-100 rounded-2xl p-6 shadow-inner mb-6">
            <form onSubmit={handleSubmitVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative col-span-1 md:col-span-2">
                <label className="block mb-1 font-medium text-gray-700">Vehicle Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="p-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full bg-white"/>
                {formData.image && (
                  <img 
                    src={URL.createObjectURL(formData.image)} 
                    alt="preview" 
                    className="rounded-xl shadow-lg object-cover w-3/4 max-w-md h-64 mt-4 mx-auto"
                  />
                )}
              </div>

              {["daily_rate","registration_number","registration_date","color","brand","model"].map(f => (
                <div key={f}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {f.replace(/_/g, ' ').toUpperCase()}
                  </label>
                  <input
                    type={f === "registration_date" ? "date" : "text"}
                    name={f}
                    value={formData[f]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${f.replace(/_/g, ' ')}`}
                    className="p-3 rounded-lg border border-purple-800 focus:outline-none focus:ring-2 focus:ring-black w-full text-black bg-white"
                  />
                </div>
              ))}

              <div className="col-span-1 md:col-span-2 flex justify-center mt-2 gap-4">
                <button type="submit" className="bg-purple-400 hover:bg-purple-500 text-white font-medium px-8 py-2 rounded-full">
                  {editingId ? "UPDATE VEHICLE" : "ADD VEHICLE"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        image: null,
                        daily_rate: "",
                        registration_number: "",
                        registration_date: "",
                        color: "",
                        brand: "",
                        model: ""
                      });
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-8 py-2 rounded-full"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
