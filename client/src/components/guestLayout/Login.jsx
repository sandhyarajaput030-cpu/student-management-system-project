import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed ❌");
        return;
      }

      // ✅ Save token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);

      // ✅ Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }

    } catch (err) {
      setMessage("Server error ❌");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.title}>Welcome Back 👋</div>
        <div style={styles.subtitle}>Login to manage your academic profile</div>

        <div style={styles.inputGroup}>
          <input
            type="email"
            name="email"
            placeholder="📧 Enter your email"
            style={styles.input}
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="🔒 Enter your password"
              style={styles.input}
              onChange={handleChange}
              value={formData.password}
              required
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </span>
          </div>
        </div>

        <div style={styles.forgot}>
          <Link to="/forgot-password" style={styles.link}>
            Forgot Password?
          </Link>
        </div>

        <button style={styles.button}>Login</button>

        <div style={styles.message}>{message}</div>

        <div style={styles.bottomText}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Segoe UI"
  },
  card: {
    width: "420px",
    padding: "45px",
    borderRadius: "20px",
    background: "white",
    boxShadow: "0 15px 35px rgba(0,0,0,0.25)"
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333"
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#555",
    fontSize: "16px",
    fontWeight: "500"
  },
  inputGroup: { marginBottom: "20px" },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid black",
    fontSize: "15px"
  },
  passwordWrapper: { position: "relative" },
  eye: {
    position: "absolute",
    right: "12px",
    top: "12px",
    cursor: "pointer"
  },
  forgot: { textAlign: "right", marginBottom: "20px" },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "14px"
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "30px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    background: "#2c2c2f",
    color: "white",
    cursor: "pointer"
  },
  bottomText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "15px"
  },
  message: {
    textAlign: "center",
    marginTop: "10px",
    color: "red"
  }
};

export default Login;