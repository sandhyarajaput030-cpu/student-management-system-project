import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaIdCard, FaBook } from "react-icons/fa";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    course: "",
    yearOfStudy: ""
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://student-management-system-project-o25c.onrender.com/api/users/register",
        formData
      );

      if (res.data.success) {
        setMessage("Registration successful ✅ Wait for admin approval 📧");
        setIsError(false);

        setFormData({
          name: "",
          email: "",
          password: "",
          contactNumber: "",
          course: "",
          yearOfStudy: ""
        });

      } else {
        setMessage(res.data.message);
        setIsError(true);
      }

    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed ❌");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Student Registration</h2>
        <p style={styles.subtitle}>Create your account</p>

        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor: isError ? "#fdecea" : "#e6f7ff",
              color: isError ? "#d93025" : "#0275d8",
              borderColor: isError ? "#f5c2c0" : "#b3e5fc"
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FaUser style={styles.icon} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              style={{ ...styles.input, border: "1px solid black", padding: "10px", borderRadius: "6px" }}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={{ ...styles.input, border: "1px solid black", padding: "10px", borderRadius: "6px" }}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{ ...styles.input, border: "1px solid black", padding: "10px", borderRadius: "6px" }}
              required
            />
            <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div style={styles.inputGroup}>
            <FaIdCard style={styles.icon} />
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              style={{ ...styles.input, border: "1px solid black", padding: "10px", borderRadius: "6px" }}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FaBook style={styles.icon} />
            <input
              type="text"
              name="course"
              placeholder="Course"
              value={formData.course}
              onChange={handleChange}
              style={{ ...styles.input, border: "1px solid black", padding: "10px", borderRadius: "6px" }}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FaBook style={styles.icon} />
            <input
              type="text"
              name="yearOfStudy"
              placeholder="Year of Study"
              value={formData.yearOfStudy}
              onChange={handleChange}
              style={{ ...styles.input, border: "1px solid black", padding: "10px", borderRadius: "6px" }}
              required
            />
          </div>

          <button style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#667eea,#764ba2)"
  },
  card: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    width: "380px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  },
  title: { textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: "20px" },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    position: "relative"
  },
  icon: { marginRight: "10px", color: "#667eea" },
  input: { flex: 1, outline: "none" },
  eyeIcon: { cursor: "pointer", position: "absolute", right: "10px" },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2c2c2f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  message: {
    padding: "10px",
    border: "1px solid",
    marginBottom: "15px",
    borderRadius: "6px"
  }
};

export default Register;
