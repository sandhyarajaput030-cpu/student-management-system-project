import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Correct base URL
const API_BASE = "http://localhost:8000/api/users";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email) return setMessage("⚠️ Please enter your email address!");

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/forgot-password`, { email });
      setMessage(res.data?.message || "Temporary password sent ✅");
      setEmail("");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to send temporary password!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardOuterStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>🔑 Forgot Password</h2>
          <p style={subtitleStyle}>Enter your registered email to reset password</p>

          {message && <p style={msgStyle}>{message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="📧 Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />

            <button type="submit" style={btnStyle} disabled={isLoading}>
              {isLoading ? "Sending... ⏳" : "Send Temporary Password ✅"}
            </button>
          </form>

          <p style={footerText}>
            Remembered your password?{" "}
            <span style={linkStyle} onClick={() => navigate("/login")}>
              Sign In 🔑
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

/* ================= STYLES ================= */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f7f7f7",
};

const cardOuterStyle = {
  padding: "3px",
  borderRadius: "15px",
  background: "linear-gradient(135deg, #000, #555)",
};

const cardStyle = {
  background: "#fff",
  padding: "40px",
  width: "420px",
  borderRadius: "15px",
  boxShadow: "0px 8px 25px rgba(0,0,0,0.25)",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "8px",
  color: "#111",
};

const subtitleStyle = {
  textAlign: "center",
  marginBottom: "25px",
  color: "#666",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px",
};

const footerText = {
  textAlign: "center",
  marginTop: "15px",
  fontSize: "14px",
};

const linkStyle = {
  color: "#000",
  fontWeight: "bold",
  cursor: "pointer",
};

const msgStyle = {
  textAlign: "center",
  marginBottom: "10px",
  color: "red",
  fontWeight: "bold",
};