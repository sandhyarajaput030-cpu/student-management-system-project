import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const StudentLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token & user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#4d5155",
          padding: "15px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff"
        }}
      >
        <h2 style={{ margin: 0 }}>👩‍🎓 Student Panel</h2>

        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <Link to="/student" style={linkStyle}>Dashboard</Link>
          <Link to="/student/profile" style={linkStyle}>Profile</Link>
          <Link to="/student/change-password" style={linkStyle}>Change Password</Link>
          <Link to="/student/noticeboard" style={linkStyle}>Noticeboard</Link>

          <button onClick={handleLogout} style={logoutStyle}>
            Logout
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div style={{ padding: "40px", flex: 1 }}>
        <Outlet />
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#4d5155",
          color: "#fff",
          textAlign: "center",
          padding: "15px"
        }}
      >
        © 2026 Student Portal | All Rights Reserved
      </div>
    </div>
  );
};

const linkStyle = {
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "500"
};

const logoutStyle = {
  background: "#ef4444",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer"
};

export default StudentLayout;