import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Slidebar from "./components/Slidebar";

const Applications = () => {
  const menuItems = [];
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/hr/get-hr-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicants(response.data.data || []);
      } catch (error) {
        console.error("Error fetching Application details:", error);
        toast.error("Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [apiUrl]);

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

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="flex text-[#0A192F] bg-white">
      <Slidebar menuItems={menuItems} />
      <div className="flex-1 p-5 lg:ml-5 transition-all duration-300 max-md:ml-12">
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
                    <th className="border border-gray-300 px-4 py-2 text-left">Job Title</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-100 transition">
                      <td className="border border-gray-300 px-4 py-2">{app.user.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{app.user.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{app.job.title}</td>
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

export default Applications;
