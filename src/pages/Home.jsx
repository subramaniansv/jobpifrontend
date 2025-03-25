import React from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom'; 
const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-[#0A192F] text-[#f9b925] flex flex-col items-center justify-center w-full py-16" id="home">
        <h1 className='text-5xl font-bold mt-10'>Jobpi</h1>
        <p className="text-white text-lg mt-4 text-center">
          Build, Analyze, and Optimize <br /> Your Resume for the Best Job Matches!
        </p>
        <div className="flex gap-4 mt-6">
          <Button text="Create Resume" onClick={handleLogin} />
          <Button text="Analyse Resume" onClick={handleLogin} />
          </div>
      </div>

      {/* About Section */}
      <div className="text-[#0A192F] flex flex-col items-center justify-center bg-white py-16 px-6" id="about">
        <h2 className="text-4xl font-bold">About Jobpi</h2>
        <p className="mt-4 text-center max-w-2xl">
          <span className="text-amber-500 text-2xl font-semibold">Jobpi</span> is an AI-powered platform designed to simplify job searching and resume building.
          We help job seekers craft compelling resumes, analyze their profiles, and connect with the right opportunities.
        </p>
        <div className="mt-6 text-center max-w-xl">
          <h3 className="text-2xl text-amber-500 font-semibold">Our Mission</h3>
          <p>To empower job seekers with smart tools that enhance their chances of landing their dream job.</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#d9dee7] text-[#0A192F] flex flex-col items-center justify-center py-16 px-6" id="feature">
        <h2 className="text-4xl font-bold">Features</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-amber-500">AI Resume Builder</h3>
            <p className="mt-2">Create professional, ATS-friendly resumes effortlessly.</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-amber-500">Resume Analysis</h3>
            <p className="mt-2">Optimize your resume with AI-powered feedback and scoring.</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-amber-500">Smart Job Matching</h3>
            <p className="mt-2">Find jobs tailored to your skills and experience.</p>
          </div>
        </div>
      </div>
      <div className="bg-white text-[#0A192F] flex flex-col items-center justify-center py-16 px-6" id="hr">
        <h2 className="text-4xl font-bold">Find the Right Talent, Faster with Jobpi!</h2>
        <p className="mt-4 text-center max-w-2xl">
          Struggling to find the perfect candidates? <span className="text-amber-500 text-2xl font-semibold">Jobpi</span> makes hiring seamless with AI-powered tools that match your job vacancies with the best-fit applicants. <strong>Post a job today</strong> and let smart matching do the work for you!
        </p>
        <div className="mt-6 text-center max-w-xl">
          <h3 className="text-2xl text-amber-500 font-semibold">Why Choose Jobpi?</h3>
          <ul className="list-disc mt-4 text-lg text-left">
            <li><strong>Post Jobs in Minutes</strong></li>
            <li><strong>Get AI-Analyzed Resumes</strong></li>
            <li><strong>Find the Best Matches Instantly</strong></li>
          </ul>
        </div>
        <button className="mt-6 bg-amber-500 text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-amber-600 transition" onClick={()=>navigate("hr-login")}>
          Post a Job Now
        </button>
      </div>
      {/* Footer Section */}
      <footer className="bg-[#0A192F] text-white text-center py-6 ">
        <p>&copy; {new Date().getFullYear()} Jobpi. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-[#f9b925] transition">Privacy Policy</a>
          <a href="#" className="hover:text-[#f9b925] transition">Terms of Service</a>
          <a href="#" className="hover:text-[#f9b925] transition">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;