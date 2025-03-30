import React, { useState } from "react";
import {FaFilter,FaBars,FaTimes,} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import axios from'axios';
import { useEffect } from "react";
const SearchJobs = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    datePosted: "",
    skills: "",
    company: "",
  });
  const [loading,setLoading] = useState(false);
  const[jobs,setJobs]= useState([]);
  const [searched, setSearched] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
    console.log("Fetching jobs with:", queryParams);
    const res = await axios.get(`${apiUrl}/api/user/get-jobs?${queryParams}`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )
    setJobs(res.data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }finally{
      setLoading(false)
    }
    setLoading(false);
  };
  useEffect(()=>{
    applyFilters();
  },[]);
  return (
    <div className="flex bg-[#ffffff]">
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 text-white bg-[#0a192fd5] p-2 rounded-full z-50"
        >
          <FaBars size={24} />
        </button>
      )}
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative w-64 h-full bg-gray-900 text-white fixed top-0 left-0 transition-transform duration-300 z-40`}
      >
        {/* Sidebar Header */}
        <div className="p-5 flex justify-between items-center border-b border-gray-700">
          <h1
            className="text-3xl font-bold text-amber-400 cursor-pointer"
            onClick={() => navigate("/ur")}
          >
            Jobpi
          </h1>
          {/* Close Button (Mobile) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white bg-gray-700 p-2 rounded-full hover:text-amber-400"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center p-3  text-amber-400">
          <FaFilter className="mr-2 text-amber-400" /> Filters
        </h2>

        {/* Job Title */}
        <div className="mb-4 px-3">
          <label className="text-white font-semibold">Job Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter job title..."
            className="p-2 border border-amber-500 rounded w-full bg-transparent text-white placeholder-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            value={filters.title}
            onChange={handleInputChange}
          />
        </div>

        {/* Location */}
        <div className="mb-4 px-3">
          <label className="text-white font-semibold">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location..."
            className="p-2 border border-amber-500 rounded w-full bg-transparent text-white placeholder-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            value={filters.location}
            onChange={handleInputChange}
          />
        </div>

        {/* Salary Range */}
        <div className="mb-4 px-3">
          <label className="text-white font-semibold">Salary Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minSalary"
              placeholder="Min"
              className="p-2 border border-amber-500 rounded w-1/2 bg-transparent text-white placeholder-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
              value={filters.minSalary}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="maxSalary"
              placeholder="Max"
              className="p-2 border border-amber-500 rounded w-1/2 bg-transparent text-white placeholder-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
              value={filters.maxSalary}
              onChange={handleInputChange}
            />
          </div>
        </div>
                 {/* Skills */}
        <div className="mb-4 px-3">
          <label className="text-white font-semibold">Skills</label>
          <input
            type="text"
            name="skills"
            placeholder="Enter skills (comma separated)..."
            className="p-2 border border-amber-500 rounded w-full bg-transparent text-white placeholder-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            value={filters.skills}
            onChange={handleInputChange}
          />
        </div>
          {/* Company Name */}
          <div className="mb-4 px-3">
          <label className="text-white font-semibold">Company Name</label>
          <input
            type="text"
            name="company"
            placeholder="Enter company name..."
            className="p-2 border border-amber-500 rounded w-full bg-transparent text-white placeholder-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            value={filters.company}
            onChange={handleInputChange}
          />
        </div>
        {/* Date Posted */}
        <div className="mb-4 px-3">
          <label className="text-white font-semibold">Date Posted</label>
          <select
            name="datePosted"
            className="p-2 border rounded w-full bg-[#0A192F] text-amber-400 border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            value={filters.datePosted}
            onChange={handleInputChange}
          >
            <option value="" className="text-white bg-[#0A192F]">
              Any time
            </option>
            <option value="1" className="text-white bg-[#0A192F]">
              Last 24 hours
            </option>
            <option value="7" className="text-white bg-[#0A192F]">
              Last 7 days
            </option>
            <option value="30" className="text-white bg-[#0A192F]">
              Last 30 days
            </option>
          </select>
        </div>

        {/* Apply Filters Button */}
        <div className="px-3">
          <button
            onClick={applyFilters}
            className="bg-amber-500 text-white w-full py-2 rounded hover:bg-amber-600 transition"
          >
            Apply Filters
          </button>
        </div>
      </aside>
      {/* Job Listings Section */}
      <div className="flex-1 p-5 lg:ml-5 transition-all duration-300 max-md:ml-12">
        <h1 className="text-3xl font-bold mb-4">Search for Jobs</h1>

        {/* Loading Animation */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-500"></div>
          </div>
        )}

        {/* No Jobs Found */}
        {!loading && searched && jobs.length === 0 && (
          <p className="text-center text-amber-500">No jobs found. Try different filters.</p>
        )}

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
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
        </div>
      </div>
   
  );
};

export default SearchJobs;
