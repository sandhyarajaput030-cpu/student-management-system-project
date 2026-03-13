import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div>

      {/* HERO SECTION */}
      <div style={styles.hero}>

        <div
          style={{
            ...styles.overlay,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0px)" : "translateY(40px)",
            transition: "all 1.5s ease"
          }}
        >

          <h1 style={styles.title}>
            Student Management System
          </h1>

          <p style={styles.subtitle}>
            Manage student registration, profiles, and academic records securely.
          </p>

          <p style={styles.text}>
            Built using MERN Stack (MongoDB, Express, React, Node.js) with secure JWT authentication and admin control.
          </p>

          <div style={{ marginTop: "30px" }}>

            <Link to="/register" style={styles.registerBtn}>
              Register
            </Link>

            <Link to="/login" style={styles.loginBtn}>
              Login
            </Link>

          </div>

          {/* Scroll Down Arrow */}
          <div style={styles.scrollArrow}>
            ↓ Scroll Down
          </div>

        </div>

      </div>


      {/* FEATURES SECTION */}
      <div style={styles.featuresSection}>

        <h2 style={styles.featuresTitle}>
          System Features
        </h2>

        <div style={styles.featureGrid}>

          <div style={styles.card}>
            <h3>Student Registration</h3>
            <p>
              Students can securely register and create their accounts.
            </p>
          </div>

          <div style={styles.card}>
            <h3>Secure Login</h3>
            <p>
              Authentication using encrypted passwords and JWT security.
            </p>
          </div>

          <div style={styles.card}>
            <h3>Profile Management</h3>
            <p>
              Students can update personal and academic information.
            </p>
          </div>

          <div style={styles.card}>
            <h3>Admin Control</h3>
            <p>
              Admin can view, manage, and control student records.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

const styles = {

  hero: {
    height: "100vh",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1509062522246-3755977927d7')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  overlay: {
    background: "rgba(0,0,0,0.65)",
    padding: "60px",
    borderRadius: "12px",
    textAlign: "center",
    color: "white",
    width: "70%",
    maxWidth: "800px"
  },

  title: {
    fontSize: "48px",
    fontWeight: "bold"
  },

  subtitle: {
    fontSize: "20px",
    marginTop: "15px"
  },

  text: {
    fontSize: "16px",
    marginTop: "10px",
    lineHeight: "1.6"
  },

  registerBtn: {
    background: "#2ecc71",
    color: "white",
    padding: "12px 28px",
    marginRight: "15px",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold"
  },

  loginBtn: {
    background: "#3498db",
    color: "white",
    padding: "12px 28px",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold"
  },

  scrollArrow: {
    marginTop: "30px",
    fontSize: "18px",
    opacity: 0.8,
    animation: "bounce 2s infinite"
  },

  featuresSection: {
    padding: "60px 20px",
    background: "#f4f6f8",
    textAlign: "center"
  },

  featuresTitle: {
    fontSize: "32px",
    marginBottom: "40px"
  },

  featureGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "250px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)"
  }

};

export default Home;