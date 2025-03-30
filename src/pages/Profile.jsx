import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SlideBar from"../components/Slidebar"
import Button from "../components/Button"
const Profile = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate(); // Initialize navigate

  const [user, setUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const[AppliedJobs,setAppliedJobs]=useState([]);
  const [loading, setLoading] = useState(true);
  const menuItems =[];
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
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(`${apiUrl}/api/user/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppliedJobs(response.data.AppliedJobs);
        console.log(response.data.AppliedJobs);
        
      } catch (error) {
        console.error("Error fetching Applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, [apiUrl]);
  const handleLogOut =  ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("role")
    navigate("/")
  }
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="sticky top-0 h-screen"><SlideBar menuItems={menuItems}/></div>
      {/* Profile Content */}
      <main className="flex-1 p-8 overflow-y-auto">
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
                    <Button
                      text={"View"}
                      onClick={() => navigate(`/job/${job._id}`)}
                    />
                     
                    
                  </div>
                ))}
              </div>
            )}
            <hr className="mt-5" />

<h3 className="text-2xl font-semibold text-[#f9b925] mt-6 mb-4">Applied Jobs</h3>
{loading ? (
  <p>Loading...</p>
) : AppliedJobs.length === 0 ? (
  <p className="text-gray-500">you didn't applied for any jobs..</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {AppliedJobs.map((job, index) => (
      <div
        key={index}
        className="p-5 bg-[#182841] rounded-lg shadow-md hover:shadow-lg transition"
      >
        <h3 className="text-2xl font-semibold text-[#f9b925]">
          {job.job.title}
        </h3>
        <p className="mt-2 mb-2 text-amber-100">
          {job.job.company} - {job.job.location}
        </p>
        <Button
          text={"View"}   onClick={() => navigate(`/job/${job.job._id}`)}
        />
        
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
