import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa";
import { Edit, Trash2, FilePlus } from "lucide-react";
import { toast } from "react-toastify";

const JobCreator = () => {
  const [jobs, setJobs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch Jobs Function
  const fetchJobs = async () => {
    if (!token) return;
    try {
      console.log("Fetching jobs...");
      const response = await axios.get(`${apiUrl}/api/hr/get-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Jobs received:", response.data);
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error.response?.data || error);
      toast.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const createBlankJob = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/hr/create-job`,
        {
          title: "Untitled Job",
          description: "No description provided",
          company: "Company Name",
          location: "Location",
          salary: "Not specified",
          skills: [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.job) {
        setJobs((prev) => [...prev, response.data.job]);
        toast.success("Blank job created!");
      } else {
        toast.error("Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job", error.response?.data);
      toast.error("Failed to create job");
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`${apiUrl}/api/hr/delete-job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success("Job deleted");
    } catch (error) {
      console.error("Error deleting Job", error);
    }
  };

  return (
    <div className="flex lg:h-screen min-h-screen bg-gray-100 text-black relative">
      <div className="flex-1 p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-[#0A192F] mb-6 max-md:ml-12">
          Your Jobs
        </h1>
        <button
          onClick={createBlankJob}
          className="bg-[#0A192F] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-amber-400 transition mb-6"
        >
          <FilePlus size={20} /> Create Blank Job
        </button>
        <button
          onClick={()=>navigate("/hr")}
          className="bg-[#0A192F] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-amber-400 transition mb-6"
        >
           Back
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job._id}
                className="bg-[#112240] p-6 rounded-lg shadow-lg border border-[#f9b925]"
              >
                <h2 className="text-lg font-semibold text-amber-400">
                  {job.title || "Untitled Job"}
                </h2>
                <p className="text-white text-sm mt-2">
                  <span className="font-semibold text-amber-400">Created:</span>{" "}
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <p className="text-white text-sm">
                  <span className="font-semibold text-amber-400">Job ID:</span>{" "}
                  {job._id}
                </p>
                <div className="flex items-center justify-around">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate(`/edit-job/${job._id}`)}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => deleteJob(job._id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No Job found. Create a new one!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCreator;
