import React from "react";
import { Link } from "react-router-dom";

const GuestNavbar = () => {

  const styles = {

    navbar: {
      width: "100%",
      background: "linear-gradient(90deg, #187587, #187587, #187587)", // nice header color
      padding: "14px 0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    },

    container: {
      maxWidth: "1200px",
      margin: "auto",
      padding: "0 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },

    /* Logo container */
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },

    logoIcon: {
      fontSize: "26px"
    },

    /* Plain text logo (no button, no box) */
    logoText: {
      fontSize: "26px",
      fontWeight: "bold",
      color: "#ffffff",
      letterSpacing: "1px"
    },

    menu: {
      display: "flex",
      gap: "15px"
    },

    link: {
      textDecoration: "none",
      color: "white",
      padding: "8px 20px",
      borderRadius: "25px",
      fontWeight: "500",
      transition: "0.3s"
    },

    home: {
      background: "linear-gradient(45deg, #ff7e5f, #feb47b)"
    },

    register: {
      background: "linear-gradient(45deg, #11998e, #38ef7d)"
    },

    login: {
      background: "linear-gradient(45deg, #396afc, #2948ff)"
    }

  };

  const hoverIn = (e) => {
    e.target.style.transform = "scale(1.08)";
  };

  const hoverOut = (e) => {
    e.target.style.transform = "scale(1)";
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>

        {/* LOGO (no button, no box) */}
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🎓</span>
          <span style={styles.logoText}>StudentMS</span>
        </div>

        {/* MENU BUTTONS */}
        <div style={styles.menu}>

          <Link to="/"
            style={{ ...styles.link, ...styles.home }}
            onMouseOver={hoverIn}
            onMouseOut={hoverOut}>
            Home
          </Link>

          <Link to="/register"
            style={{ ...styles.link, ...styles.register }}
            onMouseOver={hoverIn}
            onMouseOut={hoverOut}>
            Register
          </Link>

          <Link to="/login"
            style={{ ...styles.link, ...styles.login }}
            onMouseOver={hoverIn}
            onMouseOut={hoverOut}>
            Login
          </Link>

        </div>

      </div>
    </nav>
  );
};

export default GuestNavbar;