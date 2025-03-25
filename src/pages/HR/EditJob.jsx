import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditJob = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const [job, setJob] = useState({
        title:"",
        company:"",
        location:"",
        description:"",
        salary:"",
        skills:[]
      });
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found!");
      return;
    }
    const fetchJob = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/hr/single-job/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJob(response.data.job);
        } catch (error) {
          console.error("Error fetching job:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchJob();

},[jobId,apiUrl]  );
const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };
  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value.split(",").map((item) => item.trim()) });
  };
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}/api/hr/update-job/${jobId}`,
        job,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("job updated successfully!");
      navigate("/job-creator"); 
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-[#f9b925] mb-4">Edit Job</h1>

      <label className="block mb-2">Title:</label>
      <input type="text" name="title" value={job.title} onChange={handleChange} className="w-full p-2 border rounded-md" />

      <label className="block mt-4 mb-2">Company:</label>
      <input type="text" name="company" value={job.company} onChange={handleChange} className="w-full p-2 border rounded-md" />

      <label className="block mt-4 mb-2">Description:</label>
      <input type="text" name="description" value={job.description} onChange={handleChange} className="w-full p-2 border rounded-md" />
      <label className="block mt-4 mb-2">Skills (comma-separated):</label>
      <input type="text" name="skills" value={job.skills.join(", ")} onChange={handleArrayChange} className="w-full p-2 border rounded-md" />
      <label className="block mb-2">Location:</label>
      <input type="text" name="location" value={job.location} onChange={handleChange} className="w-full p-2 border rounded-md" />

      <label className="block mt-4 mb-2">Salary:</label>
      <input type="number" name="salary" value={job.salary} onChange={handleChange} className="w-full p-2 border rounded-md" />

      
      <button
        onClick={handleUpdate}
        className="mt-6 px-4 py-2 bg-blue-700 text-white rounded-md"
      >
        Update job
      </button>
    </div>
  )
}

export default EditJob;