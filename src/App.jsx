import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard"; 
import SearchJobs from "./pages/SearchJobs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResumeAnalysis from "./pages/AnalyzeResume";
import EditResume from "./pages/EditResume";
import ResumeBuilder from "./pages/ResumeBuilder";
import PreviewResume from "./pages/PreviewResume";
import JobDetails from'./pages/JobDetails';
//HR imports
import HrLogin from "./pages/HR/HrLogin";
import HRDashboard from "./pages/HR/HRDashboard";
import JobCreator from "./pages/HR/JobCreator";
import EditJob from "./pages/HR/EditJob";
import HrProfile from "./pages/HR/HrProfile";
import Applications from "./pages/HR/Applications";
import AllJobs from "./pages/HR/AllJobs";
import HrJobDetails from "./pages/HR/HrJobDetails";
function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup", "/hr-login"];
  const token = localStorage.getItem("token"); 
  const role = localStorage.getItem("role");

  // Redirect users based on their role when they visit "/"
  if (token && location.pathname === "/") {
    return <Navigate to={role === "hr" ? "/hr" : "/ur"} />;
  }

  // Prevent logged-in users from accessing login pages
  if (token && (location.pathname === "/login" || location.pathname === "/hr-login")) {
    return <Navigate to={role === "hr" ? "/hr" : "/ur"} />;
  }

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && !token && <Navbar />}
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hr-login" element={<HrLogin />} />

        {/* Normal User Routes */}
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/ur" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/search-job" element={token ? <SearchJobs /> : <Navigate to="/login" />} />
        <Route path="/analyze-resume" element={token ? <ResumeAnalysis /> : <Navigate to="/login" />} />
        <Route path="/resume-builder" element={token ? <ResumeBuilder /> : <Navigate to="/login" />} />
        <Route path="/preview-resume/:resumeId" element={token ? <PreviewResume /> : <Navigate to="/login" />} />
        <Route path="/job/:jobId" element={<JobDetails />} />
        <Route path="/edit-resume/:resumeId" element={<EditResume />} />

        {/* HR Routes */}
        <Route path="/hr" element={token ? <HRDashboard /> : <Navigate to="/login" />} />
        <Route path="/job-creator" element={token ? <JobCreator /> : <Navigate to="/login" />} />
        <Route path="/edit-job/:jobId" element={token ? <EditJob /> : <Navigate to="/login" />} />
        <Route path="/hr-profile" element={token ? <HrProfile /> : <Navigate to="/login" />} />
        <Route path="/hr-all-jobs" element={token ? <AllJobs /> : <Navigate to="/login" />} />
        <Route path="/hr-job/:jobId" element={token ? <HrJobDetails /> : <Navigate to="/login" />} />
        <Route path="/hr-applications" element={token ? <Applications /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
