import React, { useState } from "react";
import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";

const AdminLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // ✅ GET DATA FROM LOCALSTORAGE
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const adminName = localStorage.getItem("name") || "Admin";

  // ✅ PROTECT ADMIN ROUTE
  if (!token || role !== "admin") {
    return <Navigate to="/login" />;
  }

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  // ✅ SIDEBAR LINK STYLE
  const linkStyle = ({ isActive }) => ({
    padding: "12px",
    borderRadius: "10px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
    fontWeight: "500",
    transition: "0.3s",
    background: isActive
      ? "linear-gradient(90deg,#6366f1,#4f46e5)"
      : "transparent",
    color: isActive ? "white" : "#cbd5e1",
    boxShadow: isActive
      ? "0 4px 15px rgba(148, 117, 184, 0.5)"
      : "none",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>

      {/* ================= SIDEBAR ================= */}
      <div
        style={{
          width: sidebarOpen ? "240px" : "70px",
          background: "linear-gradient(180deg,#020617,#0f172a,#020617)",
          color: "white",
          padding: "20px",
          transition: "0.3s",
          boxShadow: "4px 0 20px rgba(0,0,0,0.4)",
        }}
      >

        {/* LOGO */}
        <div
          style={{
            marginBottom: "30px",
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          {sidebarOpen ? "🎓 Admin Panel" : "AP"}
        </div>

        {/* DASHBOARD */}
        <NavLink to="/admin" style={linkStyle}>
          🏠 {sidebarOpen && "Dashboard"}
        </NavLink>

        {/* ADMIN PROFILE */}
        <NavLink to="/admin/profile" style={linkStyle}>
          👤 {sidebarOpen && "Admin Profile"}
        </NavLink>

        {/* CHANGE PASSWORD */}
        <NavLink to="/admin/change-password" style={linkStyle}>
          🔑 {sidebarOpen && "Change Password"}
        </NavLink>

         {/* Noticeboard */}
        <NavLink to="/admin/noticeboard" style={linkStyle}>
           📢 {sidebarOpen && "Noticeboard"}
        </NavLink>

        {/* STUDENT DETAILS */}
        <NavLink to="/admin/student-details" style={linkStyle}>
           🎓 {sidebarOpen && "Student Details"}
        </NavLink>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "15px",
            padding: "12px",
            width: "100%",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            background: "#ef4444",
            color: "white",
            fontWeight: "bold",
          }}
        >
          🚪 {sidebarOpen && "Logout"}
        </button>

        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            marginTop: "15px",
            padding: "12px",
            width: "100%",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
           background: "linear-gradient(90deg,#ec4899,#8b5cf6)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {sidebarOpen ? "⬅ Collapse" : "➡"}
        </button>

      </div>

      {/* ================= MAIN SECTION ================= */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        <div
          style={{
            background: "linear-gradient(90deg,#020617,#0f172a,#020617)",
            padding: "18px 30px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          {/* TITLE */}
          <div style={{ fontSize: "22px", fontWeight: "bold" }}>
            Student Management Admin
          </div>

          {/* ADMIN NAME CLICKABLE */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              onClick={() => navigate("/admin/profile")}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              👤 {adminName}
            </span>
          </div>

        </div>

        {/* PAGE CONTENT */}
        <div
          style={{
            padding: "30px",
            flex: 1,
            background: "linear-gradient(135deg,#e2e8f0,#f8fafc)",
          }}
        >
          <Outlet />
        </div>

        {/* FOOTER */}
        <div
          style={{
            background: "linear-gradient(90deg,#020617,#0f172a,#020617)",
            color: "#cbd5e1",
            textAlign: "center",
            padding: "14px",
            fontSize: "14px",
          }}
        >
          © 2026 Student Management System • Admin Dashboard
        </div>

      </div>

    </div>
  );
};

export default AdminLayout;