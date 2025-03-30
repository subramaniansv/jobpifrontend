import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slidebar from "./components/Slidebar";
import axios from "axios";
import Button from "../../components/Button";

const AllJobs = () => {
  const menuItems = [];
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchHrJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${apiUrl}/api/hr/get-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
        } else {
          console.error("Invalid job data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHrJobs();
  }, [apiUrl]);

  
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen">
        <Slidebar menuItems={menuItems} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 lg:ml-5 transition-all duration-300 max-md:ml-12">
        <h1 className="text-3xl font-bold mb-4">My Jobs</h1>

        {/* Loading Animation */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-500"></div>
          </div>
        )}

        {/* No Jobs Found */}
        {!loading && jobs.length === 0 && (
          <p className="text-center text-amber-500">
            No jobs found. Try different filters.
          </p>
        )}

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-5 bg-[#182841] rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-2xl font-semibold text-[#f9b925]">
                {job.title}
              </h3>
              <p className="mt-2 mb-2 text-amber-100">
                {job.company} - {job.location}
              </p>
              <div className="flex justify-between"> <Button text={"Check"} onClick={() => navigate(`/hr-job/${job._id}`)} />
              <Button text={"Edit"} onClick={() => navigate(`/edit-job/${job._id}`)} /></div>
             
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
