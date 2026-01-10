import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInventories from "./pages/admin/AdminInventories";
import ManageHospitals from "./pages/admin/ManageHospitals";
import SystemRecords from "./pages/admin/AdminRecords";

import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import Inventory from "./pages/hospital/Inventory";
import RecordDonation from "./pages/hospital/RecordDonation";
import Requests from "./pages/hospital/Requests";
import Donations from "./pages/hospital/Donations";

import UserDashboard from "./pages/user/UserDashboard";
import SearchAndRequestBlood from "./pages/user/SearchAndRequestBlood";
import MyRequests from "./pages/user/MyRequests";
import AdminRecords from "./pages/admin/AdminRecords";

function App() {
  const { user } = useAuth();

  let pageClass = "red-page";
  let navClass = "white-nav";

  if (user) {
    if (user.role === "user" || user.role === "hospital") {
      pageClass = "light-page";
      navClass = "red-nav";
    } else {
      pageClass = "red-page";
      navClass = "white-nav";
    }
  }

  return (
    <div className={pageClass}>
      <Navbar navClass={navClass} />

      <Routes>
        <Route path="/" element={<Home pageClass={pageClass} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/inventories" element={<AdminInventories />} />
        <Route path="/admin/hospitals" element={<ManageHospitals />} />
        <Route path="/admin/records" element={<AdminRecords />} />

        <Route path="/hospital" element={<HospitalDashboard />} />
        <Route path="/hospital/inventory" element={<Inventory />} />
        <Route path="/hospital/donation" element={<RecordDonation />} />
        <Route path="/hospital/requests" element={<Requests />} />
        <Route path="/hospital/donations" element={<Donations />} />

        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/search" element={<SearchAndRequestBlood />} />
        <Route path="/user/my-requests" element={<MyRequests />} />
      </Routes>
    </div>
  );
}

export default App;
