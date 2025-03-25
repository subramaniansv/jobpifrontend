import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "../components/Button";
import { toast } from "react-toastify";
import axios from "axios";
import {useNavigate} from'react-router-dom'
const ResumeAnalysis = () => {
  const [resume, setResume] = useState(null);
  const [isResume,setIsResume]=useState(false);
  const[skills,setSkills]=useState([])
  const[showSkills,setShowSkills]=useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [] },
    onDrop: (acceptedFiles) => {
      setResume(acceptedFiles[0]); 
    },
  });
  const handleSave = async () => {
    if (!resume) {
      toast.error("Upload a resume");
      return;
    }
  
    setIsResume(true);
    toast.success("Resume saved successfully");
  
    const formData = new FormData();
    formData.append("file", resume);
  
    try {
      const res = await axios.post(`${apiUrl}/api/user/analyze-resume`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
          Authorization: `Bearer ${token}`,  
        },
      });
  
      console.log("Response:", res.data);
      if(res.data.resume?.skills){
        setSkills(res.data.resume.skills);
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume");
    }
  };
  const handleAnalyze =()=>{
    if (skills.length === 0) {
      toast.error("No skills found. Please upload a valid resume!");
      return;
    }
    setShowSkills(true);
  }
  const handleUpdateResume = () => {
    if (!resume) {
        toast.error("Please upload a resume first!");
        return;
      }
  };

  const handleSearchJobs = () => {
    if (!resume) {
      toast.error("Please upload a resume first!");
      return;
    }
    toast.success(`Searching jobs for: ${resume.name}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a192f] text-white">
      <h1 className="text-3xl font-bold mb-6">Upload & Analyze Resume</h1>

      {/* Resume Dropzone */}
      {isResume?(<></>):(<>
        <div
        {...getRootProps()}
        className="border-2 border-dashed border-amber-500 p-10 w-96 text-center rounded-lg cursor-pointer hover:bg-[#182841] transition"
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt size={50} className="mx-auto text-amber-400 mb-3" />
        <p className="text-amber-300">
          Drag & drop your resume here, or click to upload.
        </p>
        <p className="text-sm text-gray-400">(Supported: PDF)</p>
      </div>
      </>)}
      

      {/* Display Uploaded Resume */}
      {resume && (
        <div className="mt-4 p-3 bg-[#182841] rounded text-amber-300">
          <p>Uploaded Resume: <strong>{resume.name}</strong></p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-5 mt-6">
        {isResume?(  <>  <Button text={"Update Resume"} onClick={handleUpdateResume}/>
        <Button text={"Analyze Resume"} onClick={handleAnalyze}/></>  ):(   <>   <Button text={"Save"} onClick={handleSave}/> <Button text={"Back"} onClick={()=>navigate("/")}/> </> )}
      </div>
      {/**skills extracted */}
      {showSkills && (
        <div className="mt-6 p-4 bg-[#182841] text-white rounded-lg w-96 text-center">
          <h2 className="text-xl font-bold text-amber-400 mb-2">Extracted Skills</h2>
          <ul className="text-amber-300 grid grid-cols-4 ">
            {skills.map((skill, index) => (
              <li key={index} className="bg-[#0d1b2a] p-2 rounded m-1 ">{skill}</li>
            ))}
          </ul>
          <div className="flex justify-around items-center mt-3">
            <Button text={"Search job"} onClick={handleSearchJobs}/>
            <Button text={"Back"} onClick={()=>navigate("/")}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysis;
