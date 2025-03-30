import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Slidebar from "./components/Slidebar";

const HrJobDetails = () => {
  const menuItems = [];
  const { jobId } = useParams();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch Job Details
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/hr/single-job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.job) {
          setJob(response.data.job);
        } else {
          console.error("Invalid job data received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [apiUrl, jobId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch Applicants for this Job
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/hr/get-applications/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setApplicants(response.data);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Failed to load applicants.");
      }
    };

    fetchApplicants();
  }, [apiUrl, jobId]);

  const updateStatus = async (applicationId, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.put(
        `${apiUrl}/api/hr/update-status/${applicationId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      toast.success(response.data.message);
  
      // Refresh applicants list after update
      setApplicants((prevApplicants) =>
        prevApplicants.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update application status.");
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="sticky top-0 h-screen">
        <Slidebar menuItems={menuItems} />
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white shadow-lg border border-gray-300 rounded-lg p-6">
          {loading ? (
            <p className="text-center text-amber-500">Loading job details...</p>
          ) : job ? (
            <>
              <h1 className="text-3xl font-bold text-amber-500">
                <span className="text-[#0A192F] mr-3">Post :</span>
                {job.title}
              </h1>
              <p className="mt-2 text-lg font-medium">
                <span className="text-amber-500 mr-3">Company :</span>
                {job.company} - {job.location}
              </p>
              <p className="mt-4 text-gray-700">
                <span className="text-amber-500 font-medium mr-3">Description :</span>
                {job.description}
              </p>
              <div className="mt-4">
                <span className="text-amber-500 font-medium mr-3">Skills :</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-red-500">Job details not found.</p>
          )}
        </div>

        {/* Applications Section */}
        <div className="mt-6 bg-white shadow-lg border border-gray-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-amber-500">Applicants</h2>

          {applicants.length === 0 ? (
            <p className="text-gray-600 mt-2">No applicants yet.</p>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-100 transition">
                      <td className="border border-gray-300 px-4 py-2">{app.user.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{app.user.email}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-md text-sm ${
                            app.status === "Accepted"
                              ? "bg-green-200 text-green-700"
                              : app.status === "Rejected"
                              ? "bg-red-200 text-red-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {app.status || "Pending"}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 flex gap-2">
                        <button
                          onClick={() => updateStatus(app._id, "Accepted")}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(app._id, "Rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrJobDetails;
