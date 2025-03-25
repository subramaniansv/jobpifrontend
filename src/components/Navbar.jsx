import React from "react";
import {  useNavigate } from "react-router-dom";
import Button from "./Button";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-[#0A192F] text-white flex items-center justify-between px-6 py-4 fixed w-full top-0 shadow-md">
      <div className="text-[#f9b925] cursor-pointer text-3xl font-bold">
        Jobpi
      </div>
      <ul className="text-white md:flex gap-6 hidden">
        <li>
          <a href="#home" className="hover:text-[#f9b925] transition">Home</a>
        </li>
        <li>
          <a href="#about" className="hover:text-[#f9b925] transition">About</a>
        </li>
        <li>
          <a href="#feature" className="hover:text-[#f9b925] transition">Features</a>
        </li>
        <li>
          <a href="#hr" className="hover:text-[#f9b925] transition">Post Job</a>
        </li>
      </ul>
      <div className="flex gap-4">
        <Button text="Login" onClick={handleLogin} />
      </div>
    </nav>
  );
};

export default Navbar;
