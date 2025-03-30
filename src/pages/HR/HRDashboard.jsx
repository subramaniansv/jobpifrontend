import React, { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaSearch, FaCog, } from "react-icons/fa";
import Slidebar from "./components/Slidebar";
import DropDown from "../../components/DropDown";
import Button from "../../components/Button";
import axios from'axios'
import { useNavigate } from "react-router-dom";

const HRDashboard = () => {
    const [hrName, setHrName] = useState("")
    const navigate = useNavigate(); 
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(()=>{
      const fetchHrProfile = async () => {
        try {
          const token = localStorage.getItem("token"); 
          if (!token) return;
  
          const response = await axios.get(`${apiUrl}/api/hr/hr-profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.data.success) {
            setHrName(response.data.hr.name); 
          }
        } catch (error) {
          console.error("Error fetching Hr profile:", error);
        }
      };
  
      fetchHrProfile();
    },[])
   
    
      const menuItems = [
      
      ];
      const handleLogOut =  ()=>{
        localStorage.removeItem("token")
        navigate("/")
      }
     
  return (
    <div className="flex text-[#0A192F] bg-white">
    <Slidebar menuItems={menuItems} onLogout={handleLogOut} />
    <div className="flex-1 p-5 lg:ml-5 transition-all duration-300 max-md:ml-12">
      <div className="border-b border-gray-400 pb-5 lg:ml-0">
        <h2 className="text-4xl font-bold">Hello<span className="text-amber-500">! </span><span className="no-underline hover:underline hover:decoration-amber-500">{hrName}..</span></h2>
      </div>
       {/* Resume Management Section */}
       <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 border-b-2 border-gray-400 pb-5">
          <div className="p-5 bg-[#182841]  rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-[#f9b925]">Manage Jobs</h3>
            <p className="mt-2 text-amber-100">Create and Post your Jobs easily.</p>
            <div className="flex gap-4 mt-4">
            <Button text={"Create Job"}  onClick={()=>navigate("/job-creator")}/>
            <Button text={"My Jobs"} onClick={()=>navigate("/hr-all-jobs")}/>
     </div>
          </div>
          </div>
          </div>
      </div>
  )
}

export default HRDashboard