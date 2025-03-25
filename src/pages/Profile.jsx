import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const Profile = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate(); // Initialize navigate

  const [user, setUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]); // Initialize saved jobs
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const res = await axios.get(`${apiUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchProfile();
  }, [apiUrl]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(`${apiUrl}/api/user/saved-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSavedJobs(response.data.savedJobs);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, [apiUrl]);
  const handleLogOut =  ()=>{
    localStorage.removeItem("token")
    navigate("/")
  }
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 text-white flex flex-col p-4 bg-[#0A192F]">
        <h2 className="text-2xl font-bold text-amber-400 mb-6">Jobpi</h2>
        <nav className="flex flex-col space-y-4">
          <a href="/dashboard" className="p-2 hover:border-l-2 hover:border-amber-500 text-amber-500 hover:bg-[#505864ca]">
            Dashboard
          </a>
          <a href="/resume-builder" className="p-2 hover:border-l-2 hover:border-amber-500 text-amber-500 hover:bg-[#505864ca]">
            Create Resume
          </a>
          <a href="/search-job" className="p-2 hover:border-l-2 hover:border-amber-500 text-amber-500 hover:bg-[#505864ca]">
           Search Jobs
          </a>
        </nav>
      </aside>

      {/* Profile Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-[#0A192F]">User Profile</h2>
        {user ? (
          <>
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md mb-5">
              <p className="text-lg"><strong>Name:</strong> {user.user.name}</p>
              <p className="text-lg"><strong>Email:</strong> {user.user.email}</p>
              <p className="text-lg"><strong>Role:</strong> {user.user.role}</p>
              <p className="text-lg"><strong>Id:</strong> {user.user._id}</p>
              <button onClick={handleLogOut} className="mt-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
              >Log Out</button>
            </div>
            <hr />

            <h3 className="text-2xl font-semibold text-[#f9b925] mt-6 mb-4">Saved Jobs</h3>
            {loading ? (
              <p>Loading...</p>
            ) : savedJobs.length === 0 ? (
              <p className="text-gray-500">No jobs in the collection</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs.map((job, index) => (
                  <div
                    key={index}
                    className="p-5 bg-[#182841] rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="text-2xl font-semibold text-[#f9b925]">
                      {job.title}
                    </h3>
                    <p className="mt-2 mb-2 text-amber-100">
                      {job.company} - {job.location}
                    </p>
                    <button
                      className="mt-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
                      onClick={() => navigate(`/job/${job._id}`)}
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
};

export default Profile;
