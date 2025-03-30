import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import eye icons
import Button from "../components/Button";
import axios from"axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

    if(isLogin){
      try {
        const res = await axios.post(`${apiUrl}/api/user/userLogin`, { email, password });
          toast.success("Login successfull");
          console.log(res.data);
          localStorage.setItem("token",res.data.token);
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("role","user")
          navigate("/ur");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    else{
      try {
        const res = await axios.post(`${apiUrl}/api/user/userRegister`,{name,email,password});
        toast.success("Sign up successful");
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("userId", res.data.userId)
        navigate("/ur");
        localStorage.setItem("role","user")
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error)
      }
    }   
     };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center text-amber-400 mb-4">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h1>
        <form className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              placeholder="Password"
              className="bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Eye Icon for toggling password visibility */}
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <Button
            text={isLogin ? "Login" : "Sign Up"}
            onClick={handleSubmit}
          />
        </form>
        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-amber-400 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
