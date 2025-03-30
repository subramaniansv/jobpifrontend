import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slidebar from "./components/Slidebar";
const HrProfile = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const menuItems = [];
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          navigate("/login"); // Redirect to login if no token
          return;
        }

        const res = await axios.get(`${apiUrl}/api/hr/hr-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.hr);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, [apiUrl, navigate]);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role")
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Slidebar menuItems={menuItems} />

      {/* Profile Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-[#0A192F]">User Profile</h2>
        {user ? (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md mb-5">
            <p className="text-lg">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-lg">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-lg">
              <strong>Role:</strong> {user.role}
            </p>
            <p className="text-lg">
              <strong>Id:</strong> {user._id}
            </p>
            <button
              onClick={handleLogOut}
              className="mt-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            >
              Log Out
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
};

export default HrProfile;
