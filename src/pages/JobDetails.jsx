import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function JobDetails() {
  const { jobId } = useParams();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

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
        setSaved(response.data.saved || false); // Fetch saved state from backend
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, apiUrl]);

  const handleSaveJob = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const url = saved
        ? `${apiUrl}/api/user/remove-saved-job`
        : `${apiUrl}/api/user/save-job`;

      await axios.post(url, { jobId }, { headers: { Authorization: `Bearer ${token}` } });
      setSaved((prevSaved) => !prevSaved);
    } catch (error) {
      console.error("Error saving/removing job:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-[#001f3f] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-amber-500 mb-6">Job Portal</h2>
        <ul>
          <li className="mb-4">
            <Link to="/dashboard" className="text-lg hover:text-amber-400">Dashboard</Link>
          </li>
          <li>
            <Link to="/search-job" className="text-lg hover:text-amber-400">Search Jobs</Link>
          </li>
        </ul>
      </nav>
      
      {/* Main Content */}
      <div className="flex-1 p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-500">{job.title}</h1>
        <p className="mt-2 text-lg">{job.company} - {job.location}</p>
        <p className="mt-4">{job.description}</p>
        <button
          className={`mt-4 px-4 py-2 rounded-md font-semibold ${saved ? "bg-red-500" : "bg-green-500"} text-white`}
          onClick={handleSaveJob}
        >
          {saved ? "Remove from Saved" : "Save Job"}
        </button>
      </div>
    </div>
  );
}
