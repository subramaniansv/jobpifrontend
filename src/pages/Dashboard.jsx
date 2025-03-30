import React, { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaSearch, FaCog, } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import DropDown from "../components/DropDown";
import Button from "../components/Button";
import axios from'axios'
import { useNavigate } from "react-router-dom";
import Slidebar from "../components/Slidebar";
const Dashboard = () => {
  const [userName, setUserName] = useState("")
  const navigate = useNavigate(); 
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) return;

        const response = await axios.get(`${apiUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUserName(response.data.user.name); 
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  },[])
 

  const menuItems = [
    
  ];
  const handleLogOut =  ()=>{
    localStorage.removeItem("token")
    navigate("/")
  }
  useEffect(()=>{
    const fetchSavedJobs =async ()=>{
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/user/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedJobs(response.data.savedJobs);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setLoading(false);
    }};
    fetchSavedJobs();
  },[])
  return (
    <div className="flex text-[#0A192F] bg-white">
      <div className="sticky top-0 h-screen"> <Slidebar menuItems={menuItems}  /></div>
     
      <div className="flex-1 p-5 lg:ml-5 transition-all duration-300 max-md:ml-12">
        <div className="border-b border-gray-400 pb-5 lg:ml-0">
          <h2 className="text-4xl font-bold">Hello<span className="text-amber-500">! </span><span className="no-underline hover:underline hover:decoration-amber-500">{userName}..</span></h2>
        </div>
        
        {/* Resume Management Section */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 border-b-2 border-gray-400 pb-5">
          <div className="p-5 bg-[#182841]  rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-[#f9b925]">Manage Resumes</h3>
            <p className="mt-2 text-amber-100">Create or analyze your resume easily.</p>
            <div className="flex gap-4 mt-4">
            <Button text={"Create Resume"}  onClick={()=>navigate("/resume-builder")}/>
            <Button text={"Analyse Resume"} onClick={()=>navigate("/analyze-resume")}/>
     </div>
          </div>
        
          {/* Job Search Section */}
          <div className="p-5 bg-[#182841] rounded-lg shadow-md hover:shadow-lg transition">
      <h3 className="text-2xl font-semibold text-[#f9b925] ">Job Search</h3>
      <p className="mt-2 text-amber-100 mb-5">Find the best job opportunities.</p>
      <Button text={"Search Job"} onClick={()=>navigate("/search-job")}/>
           </div>
        </div>
        {/*Saved jobs*/}
        <div className="mt-3">
      <p className="font-semibold text-lg">Collection:</p>

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
            <Button text={"View"} onClick={()=> navigate(`/job/${job._id}`)} />
          </div>
        ))}
        </div>
      )}
    </div>
      </div>
    </div>
  );
};

export default Dashboard;
