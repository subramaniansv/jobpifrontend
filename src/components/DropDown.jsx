import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const DropDown = ({ label, options, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-3 text-white bg-gray-900 hover:border-2 border-amber-400 transitionrounded-md transition"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span>{label}</span>
        </div>
        <FiChevronDown size={18} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 ">
          <ul className="text-white">
            {options.map((option, index) => (
              <li
                key={index}
                className="p-3 hover:bg-gray-700 cursor-pointer hover:border-b-2 border-amber-400 transition"
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDown;
