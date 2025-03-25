import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ menuItems, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button (Visible When Sidebar is Closed) */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 text-white bg-[#0a192fd5]  p-2 rounded-full z-50"
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
          <h1 className="text-3xl font-bold text-amber-400">Jobpi</h1>

          {/* Close Button (X) - Only for Mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white bg-gray-700 p-2 rounded-full hover:text-amber-400"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-5">
          {menuItems.map((item, index) => (
            <div key={index} className="p-1">
              {item.dropdown ? (
                item.dropdown()
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-700 hover:border-l-2 border-amber-400 transition"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-5 w-full">
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 p-3 w-full text-left hover:bg-gray-700  hover:text-amber-400 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
