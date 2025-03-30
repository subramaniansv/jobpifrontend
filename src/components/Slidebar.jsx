import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt,  FaHome, FaFileAlt, FaSearch, FaCog, } from "react-icons/fa";

const Slidebar = ({ menuItems,  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Memoized toggle function
  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  const handleLogOut =  ()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
  }
  // Memoize menu items 
  const renderedMenuItems = useMemo(() => {
    return menuItems.map((item, index) => (
      <div key={index} className="p-1">
        
          <Link
            to={item.path}
            className="flex items-center space-x-3 p-3 hover:bg-gray-700 hover:border-l-2 border-amber-400 transition"
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
      </div>
    ));
  }, [menuItems]);

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 text-white bg-[#0a192fd5] p-2 rounded-full z-50"
          aria-label="Open Sidebar"
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 transition-transform duration-300 z-40`}
      >
        {/* Sidebar Header */}
        <div className="p-5 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-amber-400 cursor-pointer" onClick={() => navigate("/ur")}>
            Jobpi
          </h1>

          {/* Close Button (X) - Only for Mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white bg-gray-700 p-2 rounded-full hover:text-amber-400"
            aria-label="Close Sidebar"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-5 border-b-2 border-gray-700">
          <div className="p-1">
           <Link to="/ur" className="flex items-center space-x-3 p-3 hover:bg-gray-700 hover:border-l-2 border-amber-400 transition"> <FaHome className="mr-1"/>Dashboard</Link>
           <Link to="/search-job" className="flex items-center space-x-3 p-3 hover:bg-gray-700 hover:border-l-2 border-amber-400 transition"><FaSearch  className="mr-1"/> Search Jobs</Link>
          <Link to="/resume-builder" className="flex items-center space-x-3 p-3 hover:bg-gray-700 hover:border-l-2 border-amber-400 transition"><FaFileAlt className="mr-1"/> My Resume</Link>
           <Link to="/profile" className="flex items-center space-x-3 p-3 hover:bg-gray-700 hover:border-l-2 border-amber-400 transition"><FaCog  className="mr-1"/> Profile</Link>
          </div>
        </nav>

        {/* Dynamic Menu Items */}
        <nav className="mt-5">{renderedMenuItems}</nav>

        {/* Logout Button */}
        <div className="absolute bottom-5 w-full">
          <button
            onClick={handleLogOut}
            className="flex items-center space-x-3 p-3 w-full text-left hover:bg-gray-700 hover:text-amber-400 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Slidebar;
