import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const CreateResume = () => {
  const [resume, setResume] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    languages: "",
  });

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchResume();
  }, []);

  // Fetch existing resume
  const fetchResume = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/user/get-resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setResume(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          skills: res.data.skills?.join(", ") || "",
          experience: res.data.experience || [],
          education: res.data.education || [],
          certifications: res.data.certifications || [],
          projects: res.data.projects || [],
          languages: res.data.languages?.join(", ") || "",
        });
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      toast.error("Failed to load resume");
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle resume update
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${apiUrl}/api/user/update-resume/${resume._id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Resume updated successfully");
      setResume(res.data);
    } catch (error) {
      console.error("Error updating resume:", error);
      toast.error("Failed to update resume");
    }
  };

  // Handle resume creation
  const handleCreate = async () => {
    try {
      const res = await axios.post(`${apiUrl}/api/user/create-resume`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Resume created successfully");
      setResume(res.data);
    } catch (error) {
      console.error("Error creating resume:", error);
      toast.error("Failed to create resume");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a192f] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{resume ? "Edit Resume" : "Create Resume"}</h1>

      <div className="w-full max-w-lg bg-[#182841] p-6 rounded-lg shadow-md">
        <label className="block text-sm text-amber-300">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-[#0d1b2a] text-white"
        />

        <label className="block text-sm text-amber-300">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-[#0d1b2a] text-white"
        />

        <label className="block text-sm text-amber-300">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-[#0d1b2a] text-white"
        />

        <label className="block text-sm text-amber-300">Skills (comma separated)</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-[#0d1b2a] text-white"
        />

        <label className="block text-sm text-amber-300">Languages (comma separated)</label>
        <input
          type="text"
          name="languages"
          value={formData.languages}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-[#0d1b2a] text-white"
        />

        <div className="flex justify-between mt-4">
          {resume ? (
            <Button text={"Update Resume"} onClick={handleUpdate} />
          ) : (
            <Button text={"Create Resume"} onClick={handleCreate} />
          )}
          <Button text={"Back"} onClick={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
};

export default CreateResume;
