import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./context/Admincontext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Allappointments from "./pages/admin/Allappointments";
import Dashboard from "./pages/admin/Dashboard";
import Adddoctor from "./pages/admin/Adddoctor";
import Doctorslist from "./pages/admin/Doctorslist";
import { DoctorContext } from "./context/Doctorcontext";
import Doctordashboard from "./pages/doctor/Doctordashboard";
import Doctorappointments from "./pages/doctor/Doctorappointments";
import Doctorprofile from "./pages/doctor/Doctorprofile";
const App = () => {
  let { atoken } = useContext(AdminContext);
  let { dtoken } = useContext(DoctorContext);
  return atoken || dtoken ? (
    <div className="bg-[#f8f9fD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* ADMIN ROUTE */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<Allappointments />} />
          <Route path="/add-doctor" element={<Adddoctor />} />
          <Route path="/doctor-list" element={<Doctorslist />} />

          {/* DoctorRoutes */}

          <Route path="/doctor-dashboard" element={<Doctordashboard />} />
          <Route path="/doctor-appointments" element={<Doctorappointments />} />
          <Route path="/doctor-profile" element={<Doctorprofile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
