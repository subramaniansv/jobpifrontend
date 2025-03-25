import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditResume() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    languages: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    const fetchResume = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user/single-resume/${resumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResume(response.data);
      } catch (error) {
        console.error("Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, apiUrl]);

  const handleChange = (e) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };
  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setResume({ ...resume, [name]: value.split(",").map((item) => item.trim()) });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}/api/user/update-resume/${resumeId}`,
        resume,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Resume updated successfully!");
      navigate("/resume-builder"); 
    } catch (error) {
      console.error("Error updating resume:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-[#f9b925] mb-4">Edit Resume</h1>

      <label className="block mb-2">Name:</label>
      <input type="text" name="name" value={resume.name} onChange={handleChange} className="w-full p-2 border rounded-md" />

      <label className="block mt-4 mb-2">Email:</label>
      <input type="email" name="email" value={resume.email} onChange={handleChange} className="w-full p-2 border rounded-md" />

      <label className="block mt-4 mb-2">Phone:</label>
      <input type="text" name="phone" value={resume.phone} onChange={handleChange} className="w-full p-2 border rounded-md" />
      <label className="block mt-4 mb-2">Skills (comma-separated):</label>
      <input type="text" name="skills" value={resume.skills.join(", ")} onChange={handleArrayChange} className="w-full p-2 border rounded-md" />

      <label className="block mt-4 mb-2">Languages (comma-separated):</label>
      <input type="text" name="languages" value={resume.languages.join(", ")} onChange={handleArrayChange} className="w-full p-2 border rounded-md" />

      <button
        onClick={handleUpdate}
        className="mt-6 px-4 py-2 bg-blue-700 text-white rounded-md"
      >
        Update Resume
      </button>
    </div>
  );
}
