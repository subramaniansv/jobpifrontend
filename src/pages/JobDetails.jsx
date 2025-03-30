import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import SlideBar from "../components/Slidebar";

export default function JobDetails() {
  const { jobId } = useParams();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found!");
      setLoading(false);
      return;
    }
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user/get-job-id/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJob(response.data.job);
        setSaved(response.data.saved || false);

        // Fetch application status
        const appResponse = await axios.get(`${apiUrl}/api/user/application-id/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (appResponse.data.applicationId) {
          setApplied(true);
          fetchApplicationStatus(appResponse.data.applicationId);
        }
      } catch (error) {
        console.error("Error fetching job details or application status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId, apiUrl]);

  const fetchApplicationStatus = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiUrl}/api/user/status/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(res.data.status); 
    } catch (error) {
      console.log("Issue fetching application status:", error);
    }
  };

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      await axios.post(`${apiUrl}/api/user/apply`, { jobId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Applied successfully");
      setApplied(true);
      fetchApplicationStatus(jobId); // Fetch status after applying
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("You have already applied for this job");
      } else {
        console.error("Error applying:", error);
      }
    }
  };

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const appResponse = await axios.get(`${apiUrl}/api/user/application-id/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const applicationId = appResponse.data.applicationId;
      if (!applicationId) {
        console.error("Application not found");
        return;
      }

      await axios.delete(`${apiUrl}/api/user/withdraw/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Application withdrawn successfully");
      setApplied(false);
      setStatus(""); // Clear status after withdrawing
    } catch (error) {
      console.error("Error withdrawing application:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 h-screen"> 
        <SlideBar menuItems={[]} />
      </div>
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white shadow-lg border border-gray-300 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-amber-500">
            <span className="text-[#0A192F] mr-3">Post :</span>{job.title}
          </h1>
          <p className="mt-2 text-lg font-medium">
            <span className="text-amber-500 mr-3">Company :</span>
            {job.company} - {job.location}
          </p>
          <p className="mt-4 text-gray-700">
            <span className="text-amber-500 font-medium mr-3">Description :</span>{job.description}
          </p>

          <div className="mt-4">
            <span className="text-amber-500 font-medium mr-3">Skills :</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.skills.map((skill, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Buttons Section */}
          <div className="mt-6 flex gap-4">
            {/* Save Job Button */}
            <button
              className={`px-5 py-2 rounded-md font-semibold transition-all ${
                saved ? "bg-[#0A192F] hover:bg-[#152e4d]" : "bg-amber-500 hover:bg-amber-600"
              } text-white`}
              onClick={async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                  console.error("No authentication token found!");
                  return;
                }

                const url = saved
                  ? `${apiUrl}/api/user/remove-saved-job`
                  : `${apiUrl}/api/user/save-job`;

                await axios.post(url, { jobId }, { headers: { Authorization: `Bearer ${token}` } });
                setSaved(!saved);
              }}
            >
              {saved ? "Remove from Saved" : "Save Job"}
            </button>

            {/* Apply Job Button */}
            {applied ? (
              <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md" onClick={handleWithdraw}>
                Withdraw
              </button>
            ) : (
              <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md" onClick={handleApply}>
                Apply
              </button>
            )}
          </div>

          {/* Application Status */}
          {applied && (
            <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
              <p className="text-gray-800 font-semibold">Application Status:</p>
              <p className="text-lg font-medium text-blue-600">{status || "Pending"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
