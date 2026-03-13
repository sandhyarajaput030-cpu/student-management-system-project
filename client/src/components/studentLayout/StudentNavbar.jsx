import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const StudentNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  const styles = {
    sidebar: {
      width: "240px",
      height: "100vh",
      background: "linear-gradient(180deg,#1e293b,#0f172a)",
      color: "white",
      padding: "20px",
      position: "fixed",
      left: 0,
      top: 0
    },
    title: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },
    link: {
      display: "block",
      padding: "12px 15px",
      marginBottom: "10px",
      borderRadius: "8px",
      textDecoration: "none",
      color: "white",
      fontWeight: "500"
    },
    active: {
      backgroundColor: "#334155"
    },
    logout: {
      marginTop: "30px",
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      width: "100%",
      cursor: "pointer",
      fontWeight: "bold",
      background: "#ef4444",
      color: "white"
    }
  };

  return (
    <div style={styles.sidebar}>
      {/* 👇 Updated Title With 👩‍🎓 Emoji */}
      <div style={styles.title}>
        <span style={{ fontSize: "24px" }}>👩‍🎓</span>
        Student Panel
      </div>

      <NavLink
        to="/student"
        end
        style={({ isActive }) =>
          isActive ? { ...styles.link, ...styles.active } : styles.link
        }
      >
        🏠 Dashboard
      </NavLink>

      <NavLink
        to="/student/profile"
        style={({ isActive }) =>
          isActive ? { ...styles.link, ...styles.active } : styles.link
        }
      >
        👤 Student Profile
      </NavLink>

      <NavLink
        to="/student/change-password"
        style={({ isActive }) =>
          isActive ? { ...styles.link, ...styles.active } : styles.link
        }
      >
        🔑 Change Password
      </NavLink>

      <NavLink
        to="/student/noticeboard"
        style={({ isActive }) =>
          isActive ? { ...styles.link, ...styles.active } : styles.link
        }
      >
        📢 Noticeboard
      </NavLink>

      <NavLink
        to="/student/settings"
        style={({ isActive }) =>
          isActive ? { ...styles.link, ...styles.active } : styles.link
        }
      >
        ⚙️ Settings
      </NavLink>

      <button style={styles.logout} onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default StudentNavbar;