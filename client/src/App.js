import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ------------------ Guest Layout ------------------
import GuestLayout from "./components/guestLayout/GuestLayout";
import Home from "./components/guestLayout/Home";
import Login from "./components/guestLayout/Login";
import Register from "./components/guestLayout/Register";
import ForgotPassword from "./components/guestLayout/ForgotPassword";

// ------------------ Admin Layout ------------------
import AdminLayout from "./components/adminLayout/AdminLayout";
import AdminDashboard from "./components/adminLayout/AdminDashboard";
import AdminChangePassword from "./components/adminLayout/ChangePassword";
import AdminSettings from "./components/adminLayout/AdminSettings";
import AdminProfile from "./components/adminLayout/AdminProfile";
import AdminNoticeboard from "./components/adminLayout/AdminNoticeboard";
import AdminStudentDetails from "./components/adminLayout/StudentDetails";

// ------------------ Student Layout ------------------
import StudentLayout from "./components/studentLayout/StudentLayout";
import StudentDashboard from "./components/studentLayout/StudentDashboard";
import StudentProfile from "./components/studentLayout/StudentProfile";
import StudentChangePassword from "./components/studentLayout/StudentChangePassword";
import StudentNoticeboard from "./components/studentLayout/StudentNoticeboard";

// ------------------ Auth Wrappers ------------------
const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "admin") return <Navigate to="/login" replace />;
  return children;
};

const RequireStudent = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "student") return <Navigate to="/login" replace />;
  return children;
};

// ------------------ App Component ------------------
function App() {
  return (
    <>
      <Routes>

        {/* ------------------ Guest Routes ------------------ */}
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* ------------------ Admin Routes ------------------ */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="change-password" element={<AdminChangePassword />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="noticeboard" element={<AdminNoticeboard />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="student-details" element={<AdminStudentDetails />} />
        </Route>

        {/* ------------------ Student Routes ------------------ */}
        <Route
          path="/student"
          element={
            <RequireStudent>
              <StudentLayout />
            </RequireStudent>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="change-password" element={<StudentChangePassword />} />
          <Route path="noticeboard" element={<StudentNoticeboard />} />
      
        </Route>


        {/* ------------------ Catch-all Redirect ------------------ */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}

export default App;