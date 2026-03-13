import React from "react";

function GuestHeader() {
  return (
    <header style={styles.header}>
      <h2 style={styles.title}>
        Student Management System
      </h2>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "15px",
    textAlign: "center"
  },
  title: {
    margin: 0
  }
};

export default GuestHeader;