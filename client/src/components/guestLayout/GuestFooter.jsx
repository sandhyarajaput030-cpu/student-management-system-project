import React from "react";

function GuestFooter() {
  return (
    <footer style={styles.footer}>

      <h3>Student Management System</h3>

      <p>
        Manage student records, academic details, and profiles securely.
      </p>

      <p>
        © 2026 Student Management System | MERN Stack Project
      </p>

    </footer>
  );
}

const styles = {
  footer: {
    background: "#2c3e50",
    color: "white",
    textAlign: "center",
    padding: "20px",
    marginTop: "40px"
  }
};

export default GuestFooter;