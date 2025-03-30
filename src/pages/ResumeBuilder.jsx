import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { Edit, Trash2, Eye, Download,FilePlus, icons } from "lucide-react"; 
import { toast } from "react-toastify";
import Slidebar from "../components/Slidebar";
const ResumeBuilder = () => {
  const [resumes, setResumes] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const menuItems = [
    { name: "Analyze Resume",icon:<FaSearch/>, path: "/analyze-resume" },
    
  ];
  useEffect(() => {
    if (token) {
      fetchResumes();
    }
  }, [token]);

  const fetchResumes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user/all-resume`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes", error);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      await axios.delete(`${apiUrl}/api/user/delete-resume/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumes((prevResumes) => prevResumes.filter((resume) => resume._id !== resumeId));
      toast.success("Resume deleted")
    } catch (error) {
      console.error("Error deleting resume", error);
    }
  };
  const previewResume = (resumeId) => {
    window.open(`${apiUrl}/api/user/preview-resume/${resumeId}`, "_blank");
  };
  const downloadResume = async (resumeId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/user/download/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Handles binary data
      });
  
      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
  
      // Extract filename from headers (if available) or use default
      const filename =
        response.headers["content-disposition"]
          ?.split("filename=")[1]
          ?.replace(/['"]/g, "") || "resume.pdf";
  
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  const createBlankResume = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/user/create-resume`,
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResumes((prev) => [...prev, response.data]);
      toast.success("Blank resume created!");
    } catch (error) {
      console.error("Error creating resume", error);
      toast.error("Failed to create resume");
    }
  };
  const ButtonWithTooltip = ({ icon: Icon, label, onClick }) => (
    <div className="relative group">
      <button
        className="w-12 m-1 h-12 flex items-center justify-center text-white border-[#f9b925] bg-[#0A192F] border rounded-lg hover:bg-amber-400 transition"
        onClick={onClick}
      >
        <Icon size={20} />
      </button>
      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex px-2 py-1 text-xs text-white bg-black rounded">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex lg:h-screen min-h-screen bg-gray-100 text-black relative">
        <div className="sticky top-0 h-screen"> 
     <Slidebar menuItems={menuItems}  />
     </div>

      <div className="flex-1 p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-[#0A192F] mb-6 max-md:ml-12">Your Resumes</h1>
        <button
          onClick={createBlankResume}
          className="bg-[#0A192F] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-amber-400 transition mb-6"
        >
          <FilePlus size={20} /> Create Blank Resume
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resumes.length > 0 ? (
            resumes.map((resume) => (
              <div key={resume._id} className="bg-[#112240] p-6 rounded-lg shadow-lg border border-[#f9b925]">
                <h2 className="text-lg font-semibold text-amber-400">{resume.name || "Untitled Resume"}</h2>
                <p className="text-white text-sm mt-2">
                  <span className="font-semibold text-amber-400">Created:</span> {new Date(resume.createdAt).toLocaleDateString()}
                </p>
                <p className="text-white text-sm">
                  <span className="font-semibold text-amber-400">Resume ID:</span> {resume._id}
                </p>
                <div className=" flex items-center justify-around">
      <ButtonWithTooltip
        icon={Edit}
        label="Edit"
        onClick={() => navigate(`/edit-resume/${resume._id}`)}
      />
      <ButtonWithTooltip
        icon={Trash2}
        label="Delete"
        onClick={() => deleteResume(resume._id)}
      />
      <ButtonWithTooltip
        icon={Eye}
        label="Preview"
        onClick={() => previewResume(resume._id)}
      />
      <ButtonWithTooltip
        icon={Download}
        label="Download"
        onClick={() => downloadResume(resume._id)}
      />
    </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No resumes found. Create a new one!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
