import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Button = ({ text, onClick }) => {
  const showArrow = text === "Create Resume" || text === "Analyse Resume" || text === "Apply Now";

  return (
    <button
      className="text-white border-[#f9b925] bg-[#0A192F] cursor-pointer border rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-amber-400 transition"
      onClick={onClick}
    >
      {text}
      {showArrow && <FaArrowRight />}
    </button>
  );
};

export default Button;
